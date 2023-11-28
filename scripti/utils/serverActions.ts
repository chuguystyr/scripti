"use server";

import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { protector } from "@/lib/protection";

// Set of actions to handle auth-related staff

export const signUp = async (prevState: any, form: FormData) => {
  const name = form.get("name")!.toString();
  const username = form.get("username")!.toString();
  const email = form.get("email")!.toString();
  const password = form.get("password")!.toString();
  if (!name || !username || !email || !password) {
    return { message: "Please fill all fields" };
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
    return { message: "User created" };
  } catch (error:any) {
    if (error.code === 11000) {
      return { message: "This username is already taken" };
    }
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const login = async (prevState: any, form: FormData) => {
  const username = form.get("username")!.toString();
  const password = form.get("password")!.toString();
  if (!username || !password) {
    return { message: "Please fill all fields" };
  }
  await dbConnect();
  try {
    const user = await User.findOne({ username: username }, { password: 1 });
    if (!user) {
      return { message: "Invalid credentials" };
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return { message: "Invalid credetials" };
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "3h",
    });
    cookies().set("_scrpt", token, { maxAge: 60 * 60 * 3 });
    return { message: "User logged in" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

// Set of actions to handle course-related staff

export const setCourse = async (prevState: any, form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  const data = Object.fromEntries(form.entries());
    const id = Math.random().toString().slice(2, 12);
    data.id = id;
    await dbConnect();
    try {
      const result = await User.findOneAndUpdate(
        { _id: userId.id },
        { $push: { courses: data } },
        { new: true }
      );
      if (!result) {
        return { message: "Invalid credentials" };
      }
      return { message: "Course added" };
    } catch (error) {
      console.log(error);
      return { message: "Something went wrong" };
    }
};

export const editCourse = async (prevState: any, form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  const title = form.get("title")!.toString();
  const controlForm = form.get("controlForm")!.toString();
  const teacherLectures = form.get("teacherLectures")!.toString();
  const lecturesLink = form.get("lecturesLink")!.toString();
  const teacherPractices = form.get("teacherPractices")!.toString();
  const practicesLink = form.get("practicesLink")!.toString();
  const notes = form.get("notes")!.toString();
  const id = form.get("id")!.toString();

  if (!title || !controlForm || !teacherLectures || !id) {
    return { message: "Please fill all fields" };
  }
  await dbConnect();
  try {
    const course = await User.findOneAndUpdate(
      { _id: userId.id },
      {
        $set: {
          "courses.$[elem]": {
            title,
            controlForm,
            teacherLectures,
            lecturesLink,
            teacherPractices,
            practicesLink,
            notes,
          },
        },
      },
      { arrayFilters: [{ "elem.id": id }], new: true }
    );
    if (!course) {
      return { message: "Invalid credentials" };
    }
    return { message: "Course updated" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const deleteCourse = async (id: string) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  if (!user || !id) {
    return { message: "Bad request" };
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId.id },
      { $pull: { courses: { id } } }
    );
    if (!result) {
      return { message: "Invalid credentials" };
    }
    return { message: "Course deleted" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

// Set of actions to handle task-related staff

export const setTask = async (prevState: any, form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  const data = Object.fromEntries(form.entries());
  data.status = "new";
  const id = Math.random().toString().slice(2, 12);
  data.id = id;
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId.id },
      { $push: { tasks: data } },
      { new: true }
    );
    if (!result) {
      return { message: "Invalid credentials" };
    }
    return { message: "Task added" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const editTask = async (prevState: any, form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  const data = Object.fromEntries(form.entries());
  if (!data.id || !data.title || !data.date || !data.course || !data.status) {
    return { message: "Bad request" };
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId.id },
      {
        $set: {
          "tasks.$[elem]": {
            data
          },
        },
      },
      { arrayFilters: [{ "elem.id": data.id }], new: true }
    );
    if (!result) {
      return { message: "Invalid credentials" };
    }
    return { message: "Task updated" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const checkTask = async (id: string) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  if (!user || !id) {
    return { message: "Bad request" };
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId.id },
      {
        $set: {
          "tasks.$[elem].status": "done",
        },
      },
      { arrayFilters: [{ "elem.id": id }], new: true }
    );
    if (!result) {
      return { message: "Invalid credentials" };
    }
    return { message: "Task checked" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const deleteTask = async (id: string) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  const userId = user as { id: string };
  if (!user || !id) {
    return { message: "Bad request" };
  }
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId.id },
      { $pull: { tasks: { id } } }
    );
    if (!result) {
      return { message: "Invalid credentials" };
    }
    return { message: "Task deleted" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

// Set of actions to handle acount related staff

export const editAccount = async (prevState: any, form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  const data = Object.fromEntries(form.entries());
  if (!data.name || !data.username || !data.email) {
    return { message: "Bad request" };
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId.id },
      {
        $set: {
          name: data.name,
          username: data.username,
          email: data.email,
        },
      },
      { new: true }
    );
    if (!result) {
      return { message: "Invalid credentials" };
    }
    return { message: "Account updated" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const changePassword = async (prevState: any, form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  const oldPassword = form.get("oldPassword")!.toString();
  const newPassword = form.get("newPassword")!.toString();
  if (!oldPassword || !newPassword) {
    return { message: "Please fill all fields" };
  }
  await dbConnect();
  try {
    const user = await User.findOne({ _id: userId.id }, { password: 1 });
    if (!user) {
      return { message: "Invalid credentials" };
    }
    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return { message: "Invalid credetials" };
    }
    const hashedPassword = await hash(newPassword, 12);
    const result = await User.findOneAndUpdate(
      { _id: userId.id },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    if (!result) {
      return { message: "Invalid credentials" };
    }
    return { message: "Password changed" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const logout = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  cookies().set("_scrpt", "", { maxAge: 0 });
  return { message: "User logged out" };
};

export const deleteAccount = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  await dbConnect();
  try {
    const result = await User.findOneAndDelete({ _id: userId.id });
    if (!result) {
      return { message: "Invalid credentials" };
    }
    cookies().set("_scrpt", "", { maxAge: 0 });
    return { message: "Account deleted" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};