"use server"
import dbConnect from "server/db"
import { cookies } from "next/headers"
import { protector } from "server/protection"
import Course from "models/Course"
import ICourse from "types/Course"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"
import { Error as MongooseError } from "mongoose"
import { MongoServerError } from "mongodb"

export const getCourses = async (searchTerm?: string) => {
  const id = await protector(cookies().get("_scrpt")!.value)
  await dbConnect()
  try {
    const courses = (await Course.find({
      userId: new ObjectId(id),
      title: { $regex: new RegExp(searchTerm || "", "i") },
    }).lean()) as ICourse[] | null
    if (!courses) {
      return { message: "No courses found" }
    }
    return courses
  } catch {
    return { message: "Error fetching courses" }
  }
}

export const openAddCourse = () => {
  redirect("/protected/courses?add=true")
}

export const closeAddCourse = async () => {
  redirect("/protected/courses")
}

export const setCourse = async (form: FormData) => {
  const id = await protector(cookies().get("_scrpt")!.value)
  const data = Object.fromEntries(form.entries())
  await dbConnect()
  try {
    await Course.create({
      userId: new ObjectId(id),
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
  const userId = await protector(cookies().get("_scrpt")!.value)
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
      { _id: new ObjectId(id) },
      {
        $set: {
          userId: new ObjectId(userId),
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
  const user = await protector(cookies().get("_scrpt")!.value)
  const id = form.get("id")!.toString()
  if (!user || !id) {
    return
  }
  await dbConnect()
  try {
    await Course.deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.log(error)
  }
  revalidatePath("/protected/courses")
}

export const openEditCourse = () => {
  redirect("/protected/courses?edit=true")
}

export const closeEditCourse = async () => {
  redirect("/protected/courses")
}
