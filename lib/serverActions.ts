"use server";

import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "lib/db";
import User from "models/User";
import { cookies } from "next/headers";
import { protector } from "lib/protection";
import { ObjectId } from "mongodb";

// Set of actions to get data from database

export const getAccount = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  await dbConnect();
  try {
    const result: { name: string; username: string; email: string } | null =
      await User.findOne(
        { _id: id },
        { _id: 0, name: 1, email: 1, username: 1 },
      ).lean();
    if (result) {
      return result;
    }
    return { message: "Something went wrong" };
  } catch (error) {
    return { message: "Something went wrong" };
  }
};

export const getTasks = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  await dbConnect();
  try {
    const result = await User.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $project: {
          _id: 0,
          tasks: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $ne: ["$$task.status", "done"] },
            },
          },
          done: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $eq: ["$$task.status", "done"] },
              },
            },
          },
        },
      },
    ]);
    return result[0];
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const getAllTasks = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  await dbConnect();
  try {
    const result = await User.findOne({ _id: id }, { _id: 0, tasks: 1 });
    if (result) {
      return result.tasks;
    } else {
      return { message: "No tasks found" };
    }
  } catch (error) {
    return { error: "Something went wrong." };
  }
};

export const getSchedule = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  const date = new Date();
  const day = date.toLocaleDateString("uk-UA", { weekday: "long" });
  await dbConnect();
  try {
    const result = await User.aggregate([
      { $match: { _id: id } },
      { $unwind: "$schedules" },
      {
        $match: {
          $and: [
            { "schedules.from": { $lte: new Date().toLocaleDateString("de") } },
            { "schedules.to": { $gte: new Date().toLocaleDateString("de") } },
          ],
        },
      },
      {
        $addFields: {
          currentDaySchedule: day,
        },
      },
      {
        $project: {
          schedule: {
            $map: {
              input: { $objectToArray: "$currentDaySchedule" },
              as: "day",
              in: {
                k: "$$day.k",
                v: {
                  $mergeObjects: [
                    "$$day.v",
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$courses",
                            as: "course",
                            cond: { $eq: ["$$course.title", "$$day.v.course"] },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          schedule: {
            $arrayToObject: "$schedule",
          },
        },
      },
    ]);
    if (result.length === 0) {
      return { schedule: null };
    } else {
      return result[0].schedule;
    }
  } catch (err) {
    console.log(err);
    return { message: "Something went wrong" };
  }
};

export const getCourses = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  await dbConnect();
  try {
    const courses: { courses: [] } | null = await User.findOne(
      { _id: id },
      { courses: 1 },
    ).lean();
    if (!courses) {
      return { message: "No courses found" };
    }
    return courses.courses;
  } catch (error) {
    return { message: "Error fetching courses" };
  }
};

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
  } catch (error: any) {
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
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  const data = Object.fromEntries(form.entries());
  data.id = Math.random().toString().slice(2, 12);
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: id },
      { $push: { courses: data } },
      { new: true },
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
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const userId = user.id;
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
      { _id: user.id },
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
      { arrayFilters: [{ "elem.id": id }], new: true },
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
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  if (!user || !id) {
    return { message: "Bad request" };
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: user.id },
      { $pull: { courses: { id } } },
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
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  const data = Object.fromEntries(form.entries());
  data.status = "new";
  data.id = Math.random().toString().slice(2, 12);
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: id },
      { $push: { tasks: data } },
      { new: true },
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
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  const data = Object.fromEntries(form.entries());
  if (!data.id || !data.title || !data.date || !data.course || !data.status) {
    return { message: "Bad request" };
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "tasks.$[elem]": {
            data,
          },
        },
      },
      { arrayFilters: [{ "elem.id": data.id }], new: true },
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
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  if (!user || !id) {
    return { message: "Bad request" };
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: user.id },
      {
        $set: {
          "tasks.$[elem].status": "done",
        },
      },
      { arrayFilters: [{ "elem.id": id }], new: true },
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
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  if (!user || !id) {
    return { message: "Bad request" };
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: user.id },
      { $pull: { tasks: { id } } },
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

// Set of actions to handle schedule-related staff

export const setSchedule = async (prevState: any, form: FormData) => {
  const formData = Object.fromEntries(form.entries()) as {
    [key: string]: string;
  };
  if (
    formData["from"] !== "" &&
    formData["to"] !== "" &&
    formData["from"] < formData["to"] &&
    formData["from"] >
      new Date().toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
  ) {
    const user = await protector(cookies().get("_scrpt")!.value);
    if ("message" in user) {
      return { message: "Unathorised" };
    }
    const { id } = user;
    const schedule = transformData(formData);
    await dbConnect();
    try {
      const result = await User.findOneAndUpdate(
        { _id: id },
        { $push: { schedules: schedule } },
        { new: true },
      );
      if (result) {
        return { message: "Schedule set successfully" };
      } else {
        return { error: "Something went wrong." };
      }
    } catch (error) {
      return { error: "Something went wrong." };
    }
  } else {
    return { error: "Invalid data." };
  }
};

function transformData(input: { [key: string]: string }) {
  const schedule = JSON.parse(input.inputsData);
  const transformed: { [key: string]: { [key: string]: {} } } = {};
  Object.keys(schedule).forEach((key) => {
    const match = key.match(/(^[a-zA-Z]+)(\d+)/);
    if (match) {
      const day = match[1];
      const index = match[2];
      if (schedule[key].course === "") {
        return;
      }
      if (!transformed[day]) {
        transformed[day] = {};
      }
      transformed[day][index] = schedule[key];
    }
  });
  return { ...transformed, to: input.to, from: input.from };
}

// Set of actions to handle acount related staff

export const editAccount = async (prevState: any, form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  const data = Object.fromEntries(form.entries());
  if (!data.name || !data.username || !data.email) {
    return { message: "Bad request" };
  }
  await dbConnect();
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
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  const oldPassword = form.get("oldPassword")!.toString();
  const newPassword = form.get("newPassword")!.toString();
  if (!oldPassword || !newPassword) {
    return { message: "Please fill all fields" };
  }
  await dbConnect();
  try {
    const user = await User.findOne({ _id: id }, { password: 1 });
    if (!user) {
      return { message: "Invalid credentials" };
    }
    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return { message: "Invalid credetials" };
    }
    const hashedPassword = await hash(newPassword, 12);
    const result = await User.findOneAndUpdate(
      { _id: id },
      { $set: { password: hashedPassword } },
      { new: true },
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
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  cookies().set("_scrpt", "", { maxAge: 0 });
  return { message: "User logged out" };
};

export const deleteAccount = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  await dbConnect();
  try {
    const result = await User.findOneAndDelete({ _id: id });
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
