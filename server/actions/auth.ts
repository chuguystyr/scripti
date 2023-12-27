"use server";

import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "server/db";
import User from "models/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signUp = async (form: FormData) => {
  const name = form.get("name")!.toString();
  const username = form.get("username")!.toString();
  const email = form.get("email")!.toString();
  const password = form.get("password")!.toString();
  if (!name || !username || !email || !password) {
    redirect("/signup?error=fields");
  }
  try {
    await dbConnect();
    const hashedPassword = await hash(password, 12);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
  } catch (error: any) {
    if (error.code === 11000) {
      redirect("/signup?error=username");
    }
    console.log(error);
    redirect("/signup?error=internal");
  }
  redirect("/login?status=signed up");
};

export const login = async (form: FormData) => {
  const username = form.get("username")!.toString();
  const password = form.get("password")!.toString();
  if (!username || !password) {
    redirect("/login?error=fields");
  }
  try {
    await dbConnect();
  } catch (error) {
    console.log(error);
    redirect("/login?error=internal");
  }
  const user = await User.findOne(
    { username: username },
    { password: 1 },
  ).orFail(() => redirect("/login?error=credentials"));
  let match;
  try {
    const isMatch = await compare(password, user.password);
    match = isMatch;
  } catch (error) {
    console.log(error);
    redirect("/login?error=internal");
  }
  if (!match) {
    redirect("/login?error=credentials");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "3h",
  });
  cookies().set("_scrpt", token, { maxAge: 60 * 60 * 3 });
  console.log("Here");
  redirect("/protected/home");
};
