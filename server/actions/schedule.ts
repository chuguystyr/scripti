"use server"

import dbConnect from "server/db"
import User from "models/User"
import { protector } from "server/protection"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Schedule from "models/Schedule"
import { SetScheduleValidationErrors } from "types/Utilities"

export const setSchedule = async (prevState: unknown, form: FormData) => {
  const formData = Object.fromEntries(
    form.entries().map(([key, value]) => [key, value.toString()]),
  )
  const times: string[] = []
  for (let i = 0; i < 6; i++) {
    times.push(formData[`time${i}`])
  }
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
      times: times,
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
