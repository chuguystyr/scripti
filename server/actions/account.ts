"use server"

import { compare, hash } from "bcryptjs"
import jwt from "jsonwebtoken"
import dbConnect from "server/db"
import User from "models/User"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { protector } from "server/protection"
import { revalidatePath } from "next/cache"

export const signUp = async (form: FormData) => {
  const name = form.get("name")!.toString()
  const username = form.get("username")!.toString()
  const email = form.get("email")!.toString()
  const password = form.get("password")!.toString()
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
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    })
    await newUser.save()
  } catch (error: any) {
    if (error.code === 11000) {
      redirect("/signup?error=username")
    }
    console.log(error)
    redirect("/signup?error=internal")
  }
  redirect("/login?status=signed up")
}

export const login = async (form: FormData) => {
  const username = form.get("username")!.toString()
  const password = form.get("password")!.toString()
  if (!username || !password) {
    redirect("/login?error=fields")
  }
  try {
    await dbConnect()
  } catch (error) {
    console.log(error)
    redirect("/login?error=internal")
  }
  const user = await User.findOne(
    { username: username },
    { password: 1 },
  ).orFail(() => redirect("/login?error=credentials"))
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
  cookies().set("_scrpt", token, { maxAge: 60 * 60 * 3 })
  redirect("/protected/home")
}

export const getAccount = async () => {
  const id = await protector(cookies().get("_scrpt")!.value)
  try {
    await dbConnect()
    const result: { name: string; username: string; email: string } | null =
      await User.findOne(
        { _id: id },
        { _id: 0, name: 1, email: 1, username: 1 },
      ).lean()
    if (result) {
      return result
    }
  } catch (error) {
    throw new Error("Internal")
  }
  throw new Error("Internal")
}

export const openEdit = async () => {
  redirect("/protected/account?edit=true")
}

export const closeEdit = async () => {
  redirect("/protected/account")
}

export const editAccount = async (form: FormData) => {
  const id = await protector(cookies().get("_scrpt")!.value)
  const data = Object.fromEntries(form.entries())
  if (!data.name || !data.username || !data.email) {
    return { message: "Bad request" }
  }
  await dbConnect()
  try {
    const result = await User.findOneAndUpdate(
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
    if (!result) {
      return { message: "Invalid credentials" }
    }
    revalidatePath("/protected/account", "page")
    return { message: "Account updated" }
  } catch (error) {
    console.log(error)
    return { message: "Something went wrong" }
  } finally {
    redirect("/protected/account")
  }
}

export const changePassword = async (form: FormData) => {
  const id = await protector(cookies().get("_scrpt")!.value)
  const oldPassword = form.get("oldPassword")!.toString()
  const newPassword = form.get("newPassword")!.toString()
  if (!oldPassword || !newPassword) {
    return { message: "Please fill all fields" }
  }
  await dbConnect()
  let redirectURL = null
  try {
    const user = await User.findOne({ _id: id }, { password: 1 })
    if (!user) {
      return { message: "Invalid credentials" }
    }
    const isMatch = await compare(oldPassword, user.password)
    if (!isMatch) {
      redirectURL = "/protected/account?error=no-match"
    } else {
      const passwordRegex = new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,20}$/,
      )
      if (!passwordRegex.test(newPassword)) {
        redirectURL = "/protected/account?error=password"
      } else {
        const hashedPassword = await hash(newPassword, 12)
        const result = await User.findOneAndUpdate(
          { _id: id },
          { $set: { password: hashedPassword } },
          { new: true },
        )
        if (!result) {
          return { message: "Invalid credentials" }
        }
      }
    }
  } catch (error) {
    console.log(error)
    return { message: "Something went wrong" }
  }
  redirectURL = redirectURL || "/protected/account?status=password-changed"
  redirect(redirectURL)
}

export const logout = async () => {
  await protector(cookies().get("_scrpt")!.value)
  cookies().set("_scrpt", "", { maxAge: 0 })
  redirect("/")
}

export const deleteAccount = async () => {
  const id = await protector(cookies().get("_scrpt")!.value)
  await dbConnect()
  try {
    const result = await User.findOneAndDelete({ _id: id })
    if (!result) {
      return { message: "Invalid credentials" }
    }
    cookies().set("_scrpt", "", { maxAge: 0 })
  } catch (error) {
    console.log(error)
    return { message: "Something went wrong" }
  }
  redirect("/")
}
