"use server"

import dbConnect from "server/db"
import User from "models/User"
import { protector } from "server/protection"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Schedule from "models/Schedule"
import { SetScheduleValidationErrors } from "types/Utilities"
import { Types } from "mongoose"
import { DaysOfWeekArray, ScheduleDay } from "types/Schedule"
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

export const setSchedule = async (prevState: unknown, form: FormData) => {
  // TODO: fix
  const formData = Object.fromEntries(
    form.entries().map(([key, value]) => [key, value.toString()]),
  )
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  const from = new Date(formData.from.toString())
  const till = new Date(formData.till.toString())
  till.setHours(23, 59, 59, 999)
  if (
    !formData.from ||
    !formData.till ||
    till.getTime() < currentDate.getTime() ||
    from.getTime() > till.getTime()
  ) {
    return SetScheduleValidationErrors.INVALID_DATES
  }
  const id = await protector()
  const schedule = transformData(formData)
  try {
    await dbConnect()
    const majorValue = await User.findById(id)
      .lean()
      .orFail()
      .then((user) => user.majors[+formData.major])
    const result = new Schedule({
      userId: id,
      major: majorValue,
      from: from,
      till: till,
      ...schedule,
    })
    await result.save()
  } catch (error) {
    console.log("Error", error)
    return SetScheduleValidationErrors.INTERNAL_ERROR
  }
  revalidatePath("/protected/home")
  redirect(`/protected/home/${formData.major}`)
}

function transformData(input: { [key: string]: string }) {
  const schedule = JSON.parse(input.inputsData)
  const transformed: { [key: string]: { [key: string]: object } } = {}
  Object.keys(schedule).forEach((key) => {
    const match = key.match(/(^[a-zA-Z]+)(\d+)/)
    if (match) {
      const day = match[1]
      const index = match[2]
      if (schedule[key].course === "") {
        return
      }
      if (!transformed[day]) {
        transformed[day] = {}
      }
      transformed[day][index] = schedule[key]
    }
  })
  return { ...transformed }
}
