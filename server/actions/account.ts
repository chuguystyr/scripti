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

export const signUp = async (form: FormData) => {
  const name = form.get("name") as string | null
  const username = form.get("username") as string | null
  const email = form.get("email") as string | null
  const password = form.get("password") as string | null
  if (!name || !username || !email || !password) {
    redirect("/signup?error=fields")
  }
  const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
  if (!emailRegex.test(email)) {
    redirect("/signup?error=email")
  }
  const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,20}$/,
  )
  if (!passwordRegex.test(password)) {
    redirect("/signup?error=password")
  }
  try {
    await dbConnect()
    const hashedPassword = await hash(password, 12)
    const newUser: HydratedDocument<IUser> = new User({
      name,
      username,
      email,
      password: hashedPassword,
    })
    await newUser.save()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // TODOL check for the ways to use built-in instruments instead of manual if-check
    if (error.code === 11000) {
      redirect("/signup?error=username")
    }
    console.log(error)
    redirect("/signup?error=internal")
  }
  redirect("/login?status=signed up")
}

export const login = async (form: FormData) => {
  const username = form.get("username") as string | null
  const password = form.get("password") as string | null
  if (!username || !password) {
    redirect("/login?error=fields")
  }
  try {
    await dbConnect()
  } catch (error) {
    console.log(error)
    redirect("/login?error=internal")
  }
  const user = await User.findOne({ username: username }, { password: 1 })
    .orFail(() => redirect("/login?error=credentials"))
    .lean<IUser & { _id: Types.ObjectId }>()
  let match
  try {
    const isMatch = await compare(password, user.password)
    match = isMatch
  } catch (error) {
    console.log(error)
    redirect("/login?error=internal")
  }
  if (!match) {
    redirect("/login?error=credentials")
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "3h",
  })
  ;(await cookies()).set("_scrpt", token, { maxAge: 60 * 60 * 3 })
  redirect("/protected/home")
}

export const getAccount = async () => {
  const id = await protector((await cookies()).get("_scrpt")!.value)
  try {
    await dbConnect()
    const result = await User.findOne(
      { _id: id },
      { _id: 0, name: 1, email: 1, username: 1 },
    )
      .orFail(() => {
        throw new Error("Internal")
      })
      .lean<Omit<IUser, "password">>()
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
  const id = await protector((await cookies()).get("_scrpt")!.value)
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
  const id = await protector((await cookies()).get("_scrpt")!.value)
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
  await protector(cookieStore.get("_scrpt")!.value)
  cookieStore.set("_scrpt", "", { maxAge: 0 })
  redirect("/")
}

export const deleteAccount = async () => {
  const cookieStore = await cookies()
  const id = await protector(cookieStore.get("_scrpt")!.value)
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
