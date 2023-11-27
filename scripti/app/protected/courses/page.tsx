import { protector } from "@/lib/protection";
import Courses from "./Courses";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";

interface Props {
  title: string;
  teacherLectures: string;
  lecturesLink: string;
  teacherPractices: string;
  practicesLink: string;
  controlForm: string;
  notes: string;
  id: string;
}

export const getCourses = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  await dbConnect();
  try {
    const courses = await User.findOne({ _id: userId.id }, { courses: 1 });
    if (!courses) {
      return { message: "No courses found" };
    }
    return courses.courses;
  } catch (error) {
    return { message: "Error fetching courses" };
  }
};

export default async () => {
  const courses = await getCourses() as Props[];
  return <Courses courses={courses} />;
};
