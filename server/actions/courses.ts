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
import { SetCourseValidationErrors } from "types/Utilities"

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
      return []
    }
    return courses.map((course) => ({
      ...course,
      _id: course._id.toString(),
      userId: course.userId.toString(),
    }))
  } catch (error) {
    throw error
  }
}

export const openAddCourse = async () => {
  redirect("/protected/courses?add=true")
}

export const closeAddCourse = async () => {
  redirect("/protected/courses")
}

export const setCourse = async (prevState: unknown, form: FormData) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  const id = await protector(token)
  const data = Object.fromEntries(form.entries())
  try {
    await dbConnect()
    await Course.create({
      userId: new Types.ObjectId(id),
      ...data,
    })
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      for (const key in error.errors) {
        if (error.errors[key].kind === "required") {
          return SetCourseValidationErrors.EMPTY_MANDATORY_FIELD
        }
      }
    } else if (error instanceof MongoServerError && error.code === 11000) {
      return SetCourseValidationErrors.COURSE_EXISTS
    } else {
      console.log(error)
      throw error
    }
  }
  revalidatePath("/protected/courses")
}

export const editCourse = async (prevState: unknown, form: FormData) => {
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
          return SetCourseValidationErrors.EMPTY_MANDATORY_FIELD
        }
      }
    } else if (error instanceof MongoServerError && error.code === 11000) {
      return SetCourseValidationErrors.COURSE_EXISTS
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
