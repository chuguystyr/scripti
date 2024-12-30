"use server"

import dbConnect from "server/db"
import { protector } from "server/protection"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Task from "models/Task"
import { Error, Types } from "mongoose"
import { MongoServerError } from "mongodb"
import Course from "models/Course"
import { SetTaskValidationErrors } from "types/Utilities"

export const setTask = async (prevState: unknown, form: FormData) => {
  const id = await protector()
  const data = Object.fromEntries(form.entries())
  try {
    await dbConnect()
    const courseId = await Course.findOne(
      { userId: new Types.ObjectId(id), title: data.course.toString() },
      { _id: 1 },
    )
    await Task.create({
      ...data,
      userId: new Types.ObjectId(id),
      course: courseId?._id,
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
}

export const setTaskEditableAtHome = async () => {
  redirect("/protected/home?edit=true")
}

export const setTaskNonEditableAtHome = async () => {
  redirect("/protected/home")
}

export const closeEditTask = async () => {
  redirect("/protected/tasks")
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
  const id = await protector()
  const data = Object.fromEntries(form.entries())
  try {
    await dbConnect()
    const courseId = await Course.findOne(
      { userId: new Types.ObjectId(id), title: data.course },
      { _id: 1 },
    )
    await Task.findOneAndUpdate(
      { _id: data.id },
      {
        ...data,
        course: courseId?._id,
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
}

export const setTaskEditableAtTasks = async () => {
  redirect("/protected/tasks?edit=true")
}

export const setTaskNonEditableAtTasks = async () => {
  redirect("/protected/tasks")
}

const checkForMissingFields = (error: Error.ValidationError) => {
  for (const key in error.errors) {
    if (error.errors[key].kind === "required") {
      return true
    }
  }
  return false
}
