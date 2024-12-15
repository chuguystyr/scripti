"use server"
import dbConnect from "server/db"
import { protector } from "server/protection"
import Course from "models/Course"
import { revalidatePath } from "next/cache"
import { Error as MongooseError, Types } from "mongoose"
import { MongoServerError } from "mongodb"
import { SetCourseValidationErrors } from "types/Utilities"

export const setCourse = async (prevState: unknown, form: FormData) => {
  const id = await protector()
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
  const userId = await protector()
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
  revalidatePath("/protected/courses")
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
