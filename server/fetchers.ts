import "server-only"

import Course from "models/Course"
import User from "models/User"
import { Types } from "mongoose"
import { IUser } from "types/User"
import ICourse, { ControlForm, CourseType } from "types/Course"
import { protector } from "server/protection"
import dbConnect from "server/db"
import Schedule from "models/Schedule"
import { DaysOfWeekArray, ScheduleDay } from "types/Schedule"
import Task from "models/Task"

export const getAllTasks = async (major: number, searchTerm?: string) => {
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
    const tasks = await Task.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(id),
          title: { $regex: new RegExp(searchTerm || "", "i") },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $match: { "courseDetails.major": majorValue },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $addFields: {
          course: "$courseDetails.title",
        },
      },
      {
        $project: {
          courseDetails: 0,
        },
      },
    ])
    if (tasks.length > 0) {
      return tasks
    } else {
      return []
    }
  } catch {
    return []
  }
}

export const getTasks = async (major: number) => {
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
    const tasks = await Task.aggregate([
      { $match: { userId: new Types.ObjectId(id), status: { $ne: "done" } } },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $match: { "courseDetails.major": majorValue },
      },
      { $sort: { deadline: 1 } },
      {
        $unwind: "$courseDetails",
      },
      {
        $addFields: {
          course: "$courseDetails.title",
        },
      },
      {
        $addFields: {
          priority: {
            $add: [
              {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$course.type", CourseType.CORE] },
                      then: 30,
                    },
                    {
                      case: {
                        $eq: ["$course.type", CourseType.MAJOR_ELECTIVE],
                      },
                      then: 20,
                    },
                    {
                      case: { $eq: ["$course.type", CourseType.FREE_ELECTIVE] },
                      then: 10,
                    },
                  ],
                  default: 0,
                },
              },
              {
                $switch: {
                  branches: [
                    {
                      case: {
                        $eq: [
                          "$course.controlForm",
                          ControlForm.EXAM_WITH_PAPER,
                        ],
                      },
                      then: 40,
                    },
                    {
                      case: { $eq: ["$course.controlForm", ControlForm.EXAM] },
                      then: 35,
                    },
                    {
                      case: {
                        $eq: ["$course.controlForm", ControlForm.CREDIT],
                      },
                      then: 25,
                    },
                  ],
                  default: 0,
                },
              },
            ],
          },
        },
      },
      { $sort: { priority: -1 } },
      { $limit: 4 },
      {
        $project: {
          courseDetails: 0,
          priority: 0,
        },
      },
    ])
    const done = (
      await Task.find({ userId: new Types.ObjectId(id), status: "done" })
    ).length
    return { tasks, done }
  } catch (error) {
    console.log(error)
    throw new Error("Internal")
  }
}

export const getCourses = async (
  major: string | number,
  searchTerm?: string,
) => {
  const id = await protector()
  await dbConnect()
  let majorValue
  try {
    if (typeof major === "number") {
      const { majors } = await User.findOne(
        { _id: new Types.ObjectId(id) },
        { majors: 1 },
      )
        .lean<IUser>()
        .orFail()
      majorValue = majors[major]
    } else majorValue = major
    const courses = await Course.find(
      {
        userId: new Types.ObjectId(id),
        major: majorValue,
        title: { $regex: new RegExp(searchTerm || "", "i") },
      },
      {
        _id: { $toString: "$_id" },
        userId: { $toString: "$userId" },
        major: 1,
        title: 1,
        type: 1,
        teacherLectures: 1,
        teacherPractices: 1,
        controlForm: 1,
        lecturesLink: 1,
        practicesLink: 1,
        notes: 1,
      },
    ).lean<
      {
        [Key in keyof ICourse]: Key extends "_id" | "userId" ? string
        : ICourse[Key]
      }[]
    >()
    if (!courses) {
      return []
    }
    return courses
  } catch (error) {
    console.error(error)
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
            $mergeObjects: [
              { _id: "$_id" },
              { $arrayToObject: "$scheduleForToday" },
            ],
          },
        },
      },
    ])
    return result[0] as ScheduleDay
  } catch (err) {
    console.log(err)
    throw new Error("Internal")
  }
}
