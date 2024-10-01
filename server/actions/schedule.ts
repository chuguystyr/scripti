"use server"

import dbConnect from "server/db"
import User from "models/User"
import { cookies } from "next/headers"
import { protector } from "server/protection"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
export const getSchedule = async () => {
  const id = await protector(cookies().get("_scrpt")!.value)
  const date = new Date()
  const day = date.toLocaleDateString("en-US", { weekday: "long" })
  try {
    await dbConnect()
    const result = await User.aggregate([
      { $match: { _id: id } },
      { $unwind: "$schedules" },
      {
        $match: {
          $and: [
            { "schedules.from": { $lte: new Date().toLocaleDateString("ua-UK") } },
            { "schedules.to": { $gte: new Date().toLocaleDateString("ua-UK") } },
          ],
        },
      },
      {
        $addFields: {
          currentDaySchedule: `$schedules.${day}`,
        },
      },
      {
        $project: {
          schedule: {
            $map: {
              input: { $objectToArray: "$currentDaySchedule" },
              as: "day",
              in: {
                k: "$$day.k",
                v: {
                  $mergeObjects: [
                    "$$day.v",
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$courses",
                            as: "course",
                            cond: { $eq: ["$$course.title", "$$day.v.course"] },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          schedule: {
            $arrayToObject: "$schedule",
          },
        },
      },
    ])
    if (result.length === 0) {
      return { schedule: null }
    } else {
      return result[0].schedule
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
