"use server";
import dbConnect from "server/db";
import { cookies } from "next/headers";
import { protector } from "server/protection";
import User from "models/User";
import Course from "types/Course";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const getCourses = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  await dbConnect();
  try {
    const courses: { courses: Course[] } | null = await User.findOne(
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

export const openAddCourse = () => {
  redirect("/protected/courses?add=true");
}

export const closeAddCourse = () => {
  redirect("/protected/courses");
}

export const setCourse = async (form: FormData) => {
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
    revalidatePath("/protected/courses", "page");
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};