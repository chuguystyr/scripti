"use server"

import { compare, hash } from "bcryptjs"
import jwt from "jsonwebtoken"
import dbConnect from "server/db"
import User from "models/User"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { protector } from "server/protection"
import { revalidatePath } from "next/cache"
import IUser from "types/User"
import { HydratedDocument, Types } from "mongoose"
import {
  SignUpFormValidationErrors,
  LoginFormValidationErrors,
} from "types/Utilities"

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // TODO: check for the ways to use built-in instruments instead of manual if-check
    if (error.code === 11000) {
      return {
        currentState: form,
        error: SignUpFormValidationErrors.USERNAME_TAKEN,
      }
    }
    console.log(error)
    return {
      currentState: form,
      error: SignUpFormValidationErrors.INTERNAL_ERROR,
    }
  }
  redirect("/login?status=signed up")
}

export const login = async (prevState: unknown, form: FormData) => {
  const username = form.get("username") as string | null
  const password = form.get("password") as string | null
  if (!username || !password) {
    return LoginFormValidationErrors.EMPTY_MANDATORY_FIELD
  }
  try {
    await dbConnect()
    const user = await User.findOne({ username: username }, { password: 1 })
      .orFail(() => redirect("/login?error=credentials"))
      .lean<IUser & { _id: Types.ObjectId }>()
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
    return LoginFormValidationErrors.INTERNAL_ERROR
  }
  redirect("/protected/home/0")
}

export const getAccount = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  const id = await protector(token)
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

export const openEdit = async () => {
  redirect("/protected/account?edit=true")
}

export const closeEdit = async () => {
  redirect("/protected/account")
}

export const editAccount = async (form: FormData) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  const id = await protector(token)
  const data = Object.fromEntries(form.entries())
  if (!data.name || !data.username || !data.email) {
    return
  }
  await dbConnect()
  try {
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
    revalidatePath("/protected/account", "page")
  } catch (error) {
    console.log(error)
  } finally {
    redirect("/protected/account")
  }
}

export const changePassword = async (form: FormData) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  const id = await protector(token)
  const oldPassword = form.get("oldPassword") as string | null
  const newPassword = form.get("newPassword") as string | null
  let redirectURL = "/protected/account?"
  if (!oldPassword || !newPassword) {
    redirectURL += "error=missing-fields"
    redirect(redirectURL)
  }
  await dbConnect()
  try {
    const user = await User.findOne({ _id: id }, { password: 1, _id: 0 })
      .orFail(() => {
        throw new Error("Unathorised")
      })
      .lean<{ password: string }>()
    const isMatch = await compare(oldPassword, user.password)
    if (!isMatch) {
      redirectURL += "error=no-match"
      redirect(redirectURL)
    } else {
      const passwordRegex = new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,20}$/,
      )
      if (!passwordRegex.test(newPassword)) {
        redirectURL = "error=password"
        redirect(redirectURL)
      } else {
        const hashedPassword = await hash(newPassword, 12)
        await User.findOneAndUpdate(
          { _id: id },
          { $set: { password: hashedPassword } },
          { new: true },
        ).orFail(() => {
          redirectURL += "error=internal"
          redirect(redirectURL)
        })
      }
    }
  } catch (error) {
    console.log(error)
    redirectURL += "error=internal"
    redirect(redirectURL)
  }
  redirectURL = "/protected/account?status=password-changed"
  redirect(redirectURL)
}

export const logout = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  await protector(token)
  cookieStore.set("_scrpt", "", { maxAge: 0 })
  redirect("/")
}

export const deleteAccount = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("_scrpt")!.value
  const id = await protector(token)
  await dbConnect()
  try {
    await User.findOneAndDelete({ _id: id })
    cookieStore.set("_scrpt", "", { maxAge: 0 })
  } catch (error) {
    console.log(error)
    redirect("/protected/account?error=not-deleted")
  }
  redirect("/")
}
