"use server"

import { compare, hash } from "bcryptjs"
import jwt from "jsonwebtoken"
import dbConnect from "server/db"
import User from "models/User"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { protector } from "server/protection"
import { revalidatePath } from "next/cache"
import { IUser } from "types/User"
import { HydratedDocument, Types } from "mongoose"
import { MongoError } from "mongodb"
import {
  SignUpFormValidationErrors,
  LoginFormValidationErrors,
  NonSpecificErrors,
} from "types/Utilities"
import Schedule from "models/Schedule"
import Task from "models/Task"
import Course from "models/Course"

export const signUp = async (prevState: unknown, form: FormData) => {
  const name = form.get("name") as string | null
  const username = form.get("username") as string | null
  const email = form.get("email") as string | null
  const password = form.get("password") as string | null
  if (!name || !username || !email || !password) {
    return {
      currentState: form,
      error: SignUpFormValidationErrors.EMPTY_MANDATORY_FIELD,
    }
  }
  const emailRegex = new RegExp(/^[\w.-]+@[\w.-]+\.\w{2,}$/)
  if (!emailRegex.test(email)) {
    return {
      currentState: form,
      error: SignUpFormValidationErrors.INVALID_EMAIL,
    }
  }
  const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,20}$/,
  )
  if (!passwordRegex.test(password)) {
    return {
      currentState: form,
      error: SignUpFormValidationErrors.WEAK_PASSWORD,
    }
  }
  try {
    await dbConnect()
    const hashedPassword = await hash(password, 12)
    const newUser: HydratedDocument<IUser> = new User({
      name,
      username,
      email,
      password: hashedPassword,
      majors: ["default"],
    })
    await newUser.save()
  } catch (error: unknown) {
    if (error instanceof MongoError && error.code === 11000) {
      if (error.message.includes("username"))
        return {
          currentState: form,
          error: SignUpFormValidationErrors.USERNAME_TAKEN,
        }
      if (error.message.includes("email"))
        return {
          currentState: form,
          error: SignUpFormValidationErrors.EMAIL_TAKEN,
        }
    }
    console.error(error)
    return {
      currentState: form,
      error: NonSpecificErrors.INTERNAL_ERROR,
    }
  }
  redirect("/login?status=signedUp")
}

export const login = async (prevState: unknown, form: FormData) => {
  const username = form.get("username") as string | null
  const password = form.get("password") as string | null
  if (!username || !password) {
    return LoginFormValidationErrors.EMPTY_MANDATORY_FIELD
  }
  try {
    await dbConnect()
    const user = await User.findOne(
      { username: username },
      { password: 1 },
    ).lean<IUser & { _id: Types.ObjectId }>()
    if (!user) {
      return LoginFormValidationErrors.INVALID_CREDENTIALS
    }
    const isMatch = await compare(password, user.password)
    if (!isMatch) {
      return LoginFormValidationErrors.INVALID_CREDENTIALS
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "3h",
    })
    const cookieStore = await cookies()
    cookieStore.set("_scrpt", token, { maxAge: 60 * 60 * 3 })
  } catch (error) {
    console.log(error)
    return NonSpecificErrors.INTERNAL_ERROR
  }
  redirect("/protected/home/0")
}

export const getAccount = async () => {
  const id = await protector()
  try {
    await dbConnect()
    const result = await User.findOne(
      { _id: id },
      { _id: 0, name: 1, email: 1, username: 1, majors: 1 },
    )
      .orFail(() => {
        throw new Error("Internal")
      })
      .lean<Omit<IUser, "password" | "schedules">>()
    return result
  } catch {
    throw new Error("Internal")
  }
}

export const editAccount = async (prevState: unknown, form: FormData) => {
  const id = await protector()
  const data = Object.fromEntries(form.entries())
  if (!data.name || !data.username || !data.email) {
    return SignUpFormValidationErrors.EMPTY_MANDATORY_FIELD
  }
  const emailRegex = new RegExp(/^[\w.-]+@[\w.-]+\.\w{2,}$/)
  if (!emailRegex.test(data.email.toString())) {
    return SignUpFormValidationErrors.INVALID_EMAIL
  }
  try {
    await dbConnect()
    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: data.name,
          username: data.username,
          email: data.email,
        },
      },
      { new: true },
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error)
    if (error.code === 11000) {
      return SignUpFormValidationErrors.USERNAME_TAKEN
    }
    return NonSpecificErrors.INTERNAL_ERROR
  }
  revalidatePath("/protected/account", "page")
  redirect("/protected/account")
}

export const changePassword = async (prevState: unknown, form: FormData) => {
  const id = await protector()
  const oldPassword = form.get("oldPassword") as string | null
  const newPassword = form.get("newPassword") as string | null
  if (!oldPassword || !newPassword) {
    return LoginFormValidationErrors.EMPTY_MANDATORY_FIELD
  }
  await dbConnect()
  try {
    const user = await User.findOne({ _id: id }, { password: 1, _id: 0 }).lean<{
      password: string
    }>()
    if (!user) {
      return LoginFormValidationErrors.INVALID_CREDENTIALS
    }
    const isMatch = await compare(oldPassword, user.password)
    if (!isMatch) {
      return LoginFormValidationErrors.INVALID_CREDENTIALS
    }
    const passwordRegex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,20}$/,
    )
    if (!passwordRegex.test(newPassword)) {
      return SignUpFormValidationErrors.WEAK_PASSWORD
    }
    const hashedPassword = await hash(newPassword, 12)
    await User.findOneAndUpdate(
      { _id: id },
      { $set: { password: hashedPassword } },
      { new: true },
    )
  } catch (error) {
    console.log(error)
    return NonSpecificErrors.INTERNAL_ERROR
  }
  return "Password hase been changed successfully"
}

export const logout = async () => {
  await protector()
  const cookieStore = await cookies()
  cookieStore.set("_scrpt", "", { maxAge: 0 })
  redirect("/")
}

export const deleteAccount = async () => {
  const id = await protector()
  const cookieStore = await cookies()
  await dbConnect()
  try {
    await Schedule.deleteMany({ userId: id })
    await Task.deleteMany({
      course: { $in: await Course.find({ userId: id }) },
    })
    await Course.deleteMany({ userId: id })
    await User.findOneAndDelete({ _id: id })
  } catch (error: unknown) {
    console.log(error)
    return NonSpecificErrors.INTERNAL_ERROR
  }
  cookieStore.set("_scrpt", "", { maxAge: 0 })
  redirect("/")
}
