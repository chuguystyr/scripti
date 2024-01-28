"use server";
import dbConnect from "server/db";
import { cookies } from "next/headers";
import { protector } from "server/protection";
import User from "models/User";
import Course from "types/Course";
import { redirect } from "next/navigation";

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