"use server"

import dbConnect from "server/db"
import { protector } from "server/protection"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Task from "models/Task"
import { Error, Types } from "mongoose"
import { MongoServerError } from "mongodb"
import Course from "models/Course"
import User from "models/User"
import { IUser } from "types/User"
import { SetTaskValidationErrors } from "types/Utilities"

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
      { $limit: 4 },
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
    const done = (
      await Task.find({ userId: new Types.ObjectId(id), status: "done" })
    ).length
    return { tasks, done }
  } catch (error) {
    console.log(error)
    throw new Error("Internal")
  }
}

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

export const openAddTask = async () => {
  redirect("/protected/tasks?add=true")
}

export const closeAddTask = async () => {
  redirect("/protected/tasks")
}

export const openAddTaskAtHome = async () => {
  redirect("/protected/home?add=true")
}

export const closeAddTaskAtHome = async () => {
  redirect("/protected/home")
}

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
