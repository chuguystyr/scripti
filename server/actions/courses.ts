"use server"
import dbConnect from "server/db"
import { cookies } from "next/headers"
import { protector } from "server/protection"
import Course from "models/Course"
import ICourse from "types/Course"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Error as MongooseError, Types } from "mongoose"
import { MongoServerError } from "mongodb"
import User from "models/User"
import { IUser } from "types/User"

export const getCourses = async (major: number, searchTerm?: string) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  const id = await protector(token)
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
      return { message: "No courses found" }
    }
    return courses
  } catch {
    return { message: "Error fetching courses" }
  }
}

export const openAddCourse = async () => {
  redirect("/protected/courses?add=true")
}

export const closeAddCourse = async () => {
  redirect("/protected/courses")
}

export const setCourse = async (form: FormData) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  const id = await protector(token)
  const data = Object.fromEntries(form.entries())
  await dbConnect()
  try {
    await Course.create({
      userId: new Types.ObjectId(id),
      ...data,
    })
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      for (const key in error.errors) {
        if (error.errors[key].kind === "required") {
          redirect("/protected/courses?add=true&error=fields")
        }
      }
    } else if (error instanceof MongoServerError && error.code === 11000) {
      redirect("/protected/courses?add=true&error=title")
    } else {
      console.log(error)
    }
  }
  revalidatePath("/protected/courses")
  await closeAddCourse()
}

export const editCourse = async (form: FormData) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  const userId = await protector(token)
  const title = form.get("title")!.toString()
  const controlForm = form.get("controlForm")!.toString()
  const teacherLectures = form.get("teacherLectures")!.toString()
  const lecturesLink = form.get("lecturesLink")!.toString()
  const teacherPractices = form.get("teacherPractices")!.toString()
  const practicesLink = form.get("practicesLink")!.toString()
  const notes = form.get("notes")!.toString()
  const id = form.get("id")!.toString()
  await dbConnect()
  try {
    await Course.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          userId: new Types.ObjectId(userId),
          title,
          controlForm,
          teacherLectures,
          lecturesLink,
          teacherPractices,
          practicesLink,
          notes,
        },
      },
      { runValidators: true },
    )
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      for (const key in error.errors) {
        if (error.errors[key].kind === "required") {
          redirect("/protected/courses?edit=true&error=fields")
        }
      }
    } else if (error instanceof MongoServerError && error.code === 11000) {
      redirect("/protected/courses?edit=true&error=title")
    } else {
      console.log(error)
    }
  }
  revalidatePath("/protected/courses", "page")
  await closeEditCourse()
}

export const deleteCourse = async (form: FormData) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  const user = await protector(token)
  const id = form.get("id")!.toString()
  if (!user || !id) {
    return
  }
  await dbConnect()
  try {
    await Course.deleteOne({ _id: new Types.ObjectId(id) })
  } catch (error) {
    console.log(error)
  }
  revalidatePath("/protected/courses")
}

export const openEditCourse = async () => {
  redirect("/protected/courses?edit=true")
}

export const closeEditCourse = async () => {
  redirect("/protected/courses")
}
