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
};

export const closeAddCourse = () => {
  redirect("/protected/courses");
};

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
    revalidatePath("/protected/courses");
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
  closeAddCourse();
};

export const editCourse = async (form: FormData) => {
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
    revalidatePath("/protected/courses", "page");
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
  closeEditCourse();
};

export const deleteCourse = async (form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const id = form.get("id")!.toString();
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
    revalidatePath("/protected/courses");
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const openEditCourse = () => {
  redirect("/protected/courses?edit=true");
};

export const closeEditCourse = () => {
  redirect("/protected/courses");
};
