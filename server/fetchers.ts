import "server-only"

import Course from "models/Course"
import User from "models/User"
import { Types } from "mongoose"
import { IUser } from "types/User"
import ICourse from "types/Course"
import { protector } from "server/protection"
import dbConnect from "server/db"
import Schedule from "models/Schedule"
import { DaysOfWeekArray, ScheduleDay } from "types/Schedule"

export const getCourses = async (major: number, searchTerm?: string) => {
  const id = await protector()
  await dbConnect()
  try {
    const { majors } = await User.findOne(
      { _id: new Types.ObjectId(id) },
      { majors: 1 },
    )
      .lean<IUser>()
      .orFail()
    const majorValue = majors[major]
    const courses = await Course.find({
      userId: new Types.ObjectId(id),
      major: majorValue,
      title: { $regex: new RegExp(searchTerm || "", "i") },
    }).lean<ICourse[]>()
    if (!courses) {
      return []
    }
    return courses.map((course) => ({
      ...course,
      _id: course._id.toString(),
      userId: course.userId.toString(),
    }))
  } catch (error) {
    throw error
  }
}

export const getTimes = async () => {
  try {
    const id = await protector()
    await dbConnect()
    const result = await Schedule.findOne({ userId: id }, { _id: 0, times: 1 })
    if (!result) {
      return []
    }
    return result.times
  } catch (error) {
    console.log("Error", error)
    throw new Error("Internal")
  }
}

export const getSchedule = async (major: number) => {
  const currentDate = new Date()
  const currentDay = DaysOfWeekArray[currentDate.getDay()]
  try {
    const id = await protector()
    await dbConnect()
    const majorValue = await User.findById(id)
      .lean()
      .orFail(/* TODO:add necessary logic */)
      .then((user) => user.majors[major])
    const result = await Schedule.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(id),
          major: majorValue,
          from: { $lte: currentDate },
          till: { $gte: currentDate },
        },
      },
      {
        $project: {
          scheduleForToday: {
            $objectToArray: `$${currentDay}`,
          },
        },
      },
      {
        $unwind: "$scheduleForToday",
      },
      {
        $lookup: {
          from: "courses",
          localField: "scheduleForToday.v.course",
          foreignField: "_id",
          as: "courseDetails",
          pipeline: [
            {
              $project: {
                _id: 0,
                title: 1,
                teacher: {
                  $cond: [
                    { $eq: ["$scheduleForToday.v.type", "Lecture"] },
                    "$teacherLectures",
                    "$teacherPractices",
                  ],
                },
                link: {
                  $cond: [
                    { $eq: ["$scheduleForToday.v.type", "Lecture"] },
                    "$lecturesLink",
                    "$practicesLink",
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $addFields: {
          "scheduleForToday.v.course": "$courseDetails.title",
          "scheduleForToday.v.teacher": "$courseDetails.teacher",
          "scheduleForToday.v.link": "$courseDetails.link",
        },
      },
      {
        $group: {
          _id: "$_id",
          scheduleForToday: {
            $push: {
              k: "$scheduleForToday.k",
              v: "$scheduleForToday.v",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$scheduleForToday",
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])
    return result[0] as ScheduleDay
  } catch (err) {
    console.log(err)
    throw new Error("Internal")
  }
}
