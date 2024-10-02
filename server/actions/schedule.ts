"use server"

import dbConnect from "server/db"
import User from "models/User"
import { cookies } from "next/headers"
import { protector } from "server/protection"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"
export const getSchedule = async () => {
  const id = await protector(cookies().get("_scrpt")!.value)
  try {
    await dbConnect()
    const result = await User.aggregate([
      // Find user by username (later replace wih id)
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      // Get user's schedules
      {
        $project: {
          schedules: 1,
        },
      },
      // Target schedules that are actual now
      {
        $unwind: "$schedules",
      },
      {
        $match: {
          $and: [
            {
              "schedules.from": {
                $lte: new Date().toLocaleDateString("ua-UK"),
              },
            },
            {
              "schedules.to": { $gte: new Date().toLocaleDateString("ua-UK") },
            },
          ],
        },
      },
      // Get schedules for today
      {
        $project: {
          schedules: `$schedules.${new Date().toLocaleDateString("en-US", { weekday: "long" })}`,
        },
      },
      // Turn schedules into array
      {
        $addFields: {
          schedules: {
            $map: {
              input: { $objectToArray: "$schedules" },
              as: "schedule",
              in: "$$schedule.v",
            },
          },
        },
      },
      // Iterate over courses in array and make a lookup from courses collection
      {
        $unwind: "$schedules",
      },
      {
        $lookup: {
          from: "courses",
          localField: "schedules.course",
          foreignField: "title",
          as: "course",
        },
      },
      {
        $project: {
          schedules: {
            course: {
              course: "$schedules.course",
              type: "$schedules.type",
              room: "$schedules.room",
              lecturesLink: "$course.lecturesLink",
              practicesLink: "$course.practicesLink",
            },
          },
        },
      },
      // Group all schedules into one array
      {
        $group: {
          _id: "null",
          schedule: {
            $push: "$schedules",
          },
        },
      },
      {
        $project: {
          schedule: 1,
          _id: 0,
        },
      },
    ])
    console.log(result[0].schedule)
    if (result.length === 0) {
      return { schedule: null }
    } else {
      return result[0].schedule[0]
    }
  } catch (err) {
    console.log(err)
    throw new Error("Internal")
  }
}

export const setSchedule = async (prevState: unknown, form: FormData) => {
  const formData = Object.fromEntries(form.entries()) as {
    [key: string]: string
  }
  const fromDate = new Date(
    Number(formData["from"].split(".")[2]),
    Number(formData["from"].split(".")[1]) - 1,
    Number(formData["from"].split(".")[0]),
  )
  const toDate = new Date(
    Number(formData["to"].split(".")[2]),
    Number(formData["to"].split(".")[1]) - 1,
    Number(formData["to"].split(".")[0]),
  )
  if (
    formData["from"] !== "" &&
    formData["to"] !== "" &&
    fromDate <= toDate &&
    fromDate.getDay() >= new Date().getDay()
  ) {
    const id = await protector(cookies().get("_scrpt")!.value)
    const schedule = transformData(formData)
    await dbConnect()
    try {
      const result = await User.findOneAndUpdate(
        { _id: id },
        { $push: { schedules: schedule } },
        { new: true },
      )
      if (!result) {
        return { error: "Something went wrong." }
      }
    } catch {
      return { error: "Something went wrong." }
    }
    revalidatePath("/protected/home")
    redirect("/protected/home")
  } else {
    return { error: "Invalid data." }
  }
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
  return { ...transformed, to: input.to, from: input.from }
}
