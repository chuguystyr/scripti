"use server"

import dbConnect from "server/db"
import { protector } from "server/protection"
import { revalidatePath } from "next/cache"
import Task from "models/Task"
import { Error, Types } from "mongoose"
import { MongoServerError } from "mongodb"
import { SetTaskValidationErrors } from "types/Utilities"
import { redirect } from "next/navigation"

export const setTask = async (prevState: unknown, form: FormData) => {
  const location = form.get("location")
  const id = await protector()
  const data = Object.fromEntries(form.entries())
  try {
    await dbConnect()
    await Task.create({
      ...data,
      userId: new Types.ObjectId(id),
      status: "new",
      deadline: new Date(data.date.toString()),
    })
  } catch (error) {
    if (error instanceof Error.ValidationError && error.errors) {
      if (error.errors.deadline) {
        return SetTaskValidationErrors.DATE_OVERDUE
      } else if (error.errors.course) {
        return SetTaskValidationErrors.COURSE_NOT_FOUND
      } else if (checkForMissingFields(error)) {
        return SetTaskValidationErrors.EMPTY_MANDATORY_FIELD
      }
    } else if (error instanceof MongoServerError && error.code === 11000) {
      return SetTaskValidationErrors.TASK_EXISTS
    } else {
      throw error
    }
  }
  revalidatePath("/protected/home")
  revalidatePath("/protected/tasks")
  if (location) redirect(location.toString())
}

export const checkTask = async (form: FormData) => {
  const id = form.get("id")
  const userId = await protector()
  if (!userId || !id) {
    return
  }
  await dbConnect()
  try {
    await Task.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()) },
      { status: "done" },
    )
    revalidatePath("/protected/home")
    revalidatePath("/protected/tasks")
  } catch (error) {
    console.log(error)
  }
}

export const makeInProgress = async (form: FormData) => {
  const id = form.get("id")
  const userId = await protector()
  if (!userId || !id) {
    return
  }
  await dbConnect()
  try {
    await Task.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()) },
      { status: "in progress" },
    )
    revalidatePath("/protected/home")
    revalidatePath("/protected/tasks")
  } catch (error) {
    console.log(error)
  }
}

export const resetTaskStatus = async (form: FormData) => {
  const id = form.get("id")
  const userId = await protector()
  if (!userId || !id) {
    return
  }
  await dbConnect()
  try {
    await Task.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()) },
      { status: "new" },
    )
    revalidatePath("/protected/home")
    revalidatePath("/protected/tasks")
  } catch (error) {
    console.log(error)
  }
}

export const deleteTask = async (form: FormData) => {
  const id = form.get("id")
  const userId = await protector()
  if (!userId || !id) {
    console.log("Bad request")
    return
  }
  await dbConnect()
  try {
    await Task.findOneAndDelete({ _id: new Types.ObjectId(id.toString()) })
    revalidatePath("/protected/home")
    revalidatePath("/protected/tasks")
  } catch (error) {
    console.log(error)
  }
}

export const editTask = async (prevState: unknown, form: FormData) => {
  const location = form.get("location")
  await protector()
  const data = Object.fromEntries(form.entries())
  try {
    await dbConnect()
    await Task.findOneAndUpdate(
      { _id: data.id },
      {
        ...data,
      },
      { runValidators: true },
    )
  } catch (error) {
    if (error instanceof Error.ValidationError && error.errors) {
      if (error.errors.deadline) {
        return SetTaskValidationErrors.DATE_OVERDUE
      } else if (error.errors.course) {
        return SetTaskValidationErrors.COURSE_NOT_FOUND
      } else if (checkForMissingFields(error)) {
        return SetTaskValidationErrors.EMPTY_MANDATORY_FIELD
      }
    } else if (error instanceof MongoServerError && error.code === 11000) {
      return SetTaskValidationErrors.TASK_EXISTS
    } else {
      throw error
    }
  }
  revalidatePath("/protected/home")
  revalidatePath("/protected/tasks")
  if (location) redirect(location.toString())
}

const checkForMissingFields = (error: Error.ValidationError) => {
  for (const key in error.errors) {
    if (error.errors[key].kind === "required") {
      return true
    }
  }
  return false
}
