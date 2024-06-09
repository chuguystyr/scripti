"use server"

import dbConnect from "server/db"
import { cookies } from "next/headers"
import { protector } from "server/protection"
import { ObjectId } from "mongodb"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Task from "models/Task"
import { Error } from "mongoose"
import { MongoServerError } from "mongodb"
import Course from "models/Course"

export const getTasks = async () => {
  const id = await protector(cookies().get("_scrpt")!.value)
  await dbConnect()
  try {
    const tasks = await Task.aggregate([
      { $match: { userId: new ObjectId(id), status: { $ne: "done" } } },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
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
    const done = (await Task.find({ userId: new ObjectId(id), status: "done" }))
      .length
    return { tasks, done }
  } catch (error) {
    console.log(error)
    throw new Error("Internal")
  }
}

export const getAllTasks = async (searchTerm?: string) => {
  const id = await protector(cookies().get("_scrpt")!.value)
  await dbConnect()
  try {
    const tasks = await Task.aggregate([
      {
        $match: {
          userId: new ObjectId(id),
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
      return { message: "No tasks found" }
    }
  } catch (error) {
    return { error: "Something went wrong." }
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

export const setTask = async (form: FormData) => {
  const id = await protector(cookies().get("_scrpt")!.value)
  const data = Object.fromEntries(form.entries())
  await dbConnect()
  try {
    const courseId = await Course.findOne(
      { userId: new ObjectId(id), title: data.course.toString() },
      { _id: 1 },
    )
    await Task.create({
      ...data,
      userId: new ObjectId(id),
      course: courseId?._id,
      status: "new",
      deadline: new Date(data.date.toString()),
    })
    revalidatePath("/protected/home")
    revalidatePath("/protected/tasks")
  } catch (error) {
    if (error instanceof Error.ValidationError && error.errors) {
      if (error.errors.deadline) {
        redirect("/protected/tasks?add=true&error=date")
      } else if (error.errors.course) {
        redirect("/protected/tasks?add=true&error=course")
      } else if (checkForMissingFields(error)) {
        redirect("/protected/tasks?add=true&error=fields")
      }
    } else if (error instanceof MongoServerError && error.code === 11000) {
      redirect("/protected/tasks?add=true&error=title")
    } else {
      throw error
    }
  }
  await closeAddTask()
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
  const userId = await protector(cookies().get("_scrpt")!.value)
  if (!userId || !id) {
    return { message: "Bad request" }
  }
  await dbConnect()
  try {
    await Task.findOneAndUpdate({ _id: id }, { status: "done" })
    revalidatePath("/protected/home")
    revalidatePath("/protected/tasks")
  } catch (error) {
    console.log(error)
    return { message: "Something went wrong" }
  }
}

export const deleteTask = async (form: FormData) => {
  const id = form.get("id")
  const userId = await protector(cookies().get("_scrpt")!.value)
  if (!userId || !id) {
    console.log("Bad request")
    return { message: "Bad request" }
  }
  await dbConnect()
  try {
    await Task.findOneAndDelete({ _id: id })
    revalidatePath("/protected/home")
    revalidatePath("/protected/tasks")
  } catch (error) {
    console.log(error)
    return { message: "Something went wrong" }
  }
}

export const editTask = async (form: FormData) => {
  const id = await protector(cookies().get("_scrpt")!.value)
  const data = Object.fromEntries(form.entries())
  await dbConnect()
  try {
    const courseId = await Course.findOne(
      { userId: new ObjectId(id), title: data.course },
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
        redirect("/protected/tasks?edit=true&error=date")
      } else if (error.errors.course) {
        redirect("/protected/tasks?edit=true&error=course")
      } else if (checkForMissingFields(error)) {
        redirect("/protected/tasks?edit=true&error=fields")
      }
    } else if (error instanceof MongoServerError && error.code === 11000) {
      redirect("/protected/tasks?edit=true&error=title")
    } else {
      throw error
    }
  }
  revalidatePath("/protected/home")
  revalidatePath("/protected/tasks")
  await closeEditTask()
}

export const setTaskEditableAtTasks = async () => {
  redirect("/protected/tasks?edit=true")
}

export const setTaskNonEditableAtTasks = async () => {
  redirect("/protected/tasks")
}

const checkForMissingFields = (error: Error.ValidationError) => {
  for (let key in error.errors) {
    if (error.errors[key].kind === "required") {
      return true
    }
  }
  return false
}
