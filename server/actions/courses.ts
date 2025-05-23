"use server"
import dbConnect from "server/db"
import { protector } from "server/protection"
import Course from "models/Course"
import { revalidatePath } from "next/cache"
import { Error as MongooseError, Types } from "mongoose"
import { MongoServerError } from "mongodb"
import { SetCourseValidationErrors } from "types/Utilities"
import User from "models/User"
import { redirect } from "next/navigation"

export const setCourse = async (prevState: unknown, form: FormData) => {
  const id = await protector()
  const data = Object.fromEntries(form.entries())
  try {
    await dbConnect()
    const majorValue = await User.getMajorValueByNumber(id, +data.major)
    await Course.create({
      ...data,
      userId: new Types.ObjectId(id),
      major: majorValue,
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
  redirect(`/protected/courses/${data.major}`)
}

export const editCourse = async (prevState: unknown, form: FormData) => {
  const userId = await protector()
  const title = form.get("title")!.toString()
  const controlForm = form.get("controlForm")!.toString()
  const type = form.get("type")!.toString()
  const teacherLectures = form.get("teacherLectures")!.toString()
  const lecturesLink = form.get("lecturesLink")!.toString()
  const teacherPractices = form.get("teacherPractices")!.toString()
  const practicesLink = form.get("practicesLink")!.toString()
  const notes = form.get("notes")!.toString()
  const id = form.get("id")!.toString()
  const major = form.get("major")!.toString()
  await dbConnect()
  try {
    await Course.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          userId: new Types.ObjectId(userId),
          title,
          controlForm,
          type,
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
  revalidatePath(`/protected/courses/${major}`)
  redirect(`/protected/courses/${major}`)
}

export const deleteCourse = async (form: FormData) => {
  const user = await protector()
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
