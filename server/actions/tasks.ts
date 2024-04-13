"use server";

import dbConnect from "server/db";
import User from "models/User";
import { cookies } from "next/headers";
import { protector } from "server/protection";
import { ObjectId } from "mongodb";
import Task from "types/Task";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCourses } from "./courses";
import { get } from "node_modules/cypress/types/lodash";

export const getTasks = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  const { id } = user;
  await dbConnect();
  try {
    const result: { tasks: Task[]; done: number }[] = await User.aggregate([
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
    throw new Error("Internal");
  }
};

export const getAllTasks = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  const { id } = user;
  await dbConnect();
  try {
    const result = await User.findOne({ _id: id }, { _id: 0, tasks: 1 });
    if (result) {
      return result.tasks as Task[];
    } else {
      return { message: "No tasks found" };
    }
  } catch (error) {
    return { error: "Something went wrong." };
  }
};

export const openAddTask = async () => {
  redirect("/protected/tasks?add=true");
};

export const closeAddTask = async () => {
  redirect("/protected/tasks");
};

export const openAddTaskAtHome = async () => {
  redirect("/protected/home?add=true");
};

export const closeAddTaskAtHome = async () => {
  redirect("/protected/home");
};

export const setTask = async (form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  const data = Object.fromEntries(form.entries());
  if (!data.title || !data.date || !data.course) {
    redirect("/protected/tasks?add=true&error=fields");
  } else {
    const courses = await getCourses();
    if (Array.isArray(courses)) {
      const course = courses.find((course) => course.title === data.course);
      if (!course) {
        redirect("/protected/tasks?add=true&error=course");
      }
    } else {
      redirect("/protected/tasks?add=true&error=course");
    }
    if (new Date(data.date.toString()) < new Date()) {
      redirect("/protected/tasks?add=true&error=date");
    }
  }
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
    revalidatePath("/protected/home");
    revalidatePath("/protected/tasks");
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
  await closeAddTask();
};

export const setTaskEditableAtHome = async () => {
  redirect("/protected/home?edit=true");
};

export const setTaskNonEditableAtHome = async () => {
  redirect("/protected/home");
};

export const closeEditTask = async () => {
  redirect("/protected/tasks");
};

export const checkTask = async (form: FormData) => {
  const id = form.get("id");
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
      { _id: user.id, "tasks.id": id },
      {
        $set: {
          "tasks.$.status": "done",
        },
      },
      { new: true },
    );
    if (!result) {
      return { message: "Invalid credentials" };
    }
    revalidatePath("/protected/home");
    revalidatePath("/protected/tasks");
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const deleteTask = async (form: FormData) => {
  const id = form.get("id");
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  if (!user || !id) {
    console.log("Bad request");
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
    revalidatePath("/protected/home");
    revalidatePath("/protected/tasks");
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};

export const editTask = async (form: FormData) => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if ("message" in user) {
    return { message: "Unathorised" };
  }
  const { id } = user;
  const data = Object.fromEntries(form.entries());
  console.log("Data object", data);
  if (!data.id || !data.title || !data.date || !data.course || !data.status) {
    redirect("/protected/tasks?edit=true&error=fields");
  }
  await dbConnect();
  try {
    const result = await User.findOneAndUpdate(
      { _id: id, "tasks.id": data.id },
      {
        $set: {
          "tasks.$": data,
        },
      },
      { new: true },
    );
    if (!result) {
      return { message: "Invalid credentials" };
    }
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
  revalidatePath("/protected/home");
  revalidatePath("/protected/tasks");
  await closeEditTask();
};

export const setTaskEditableAtTasks = async () => {
  redirect("/protected/tasks?edit=true");
};

export const setTaskNonEditableAtTasks = async () => {
  redirect("/protected/tasks");
};
