"use server";

import dbConnect from "server/db";
import User from "models/User";
import { cookies } from "next/headers";
import { protector } from "server/protection";
import { ObjectId } from "mongodb";
import Task from "types/Task";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
}

export const closeAddTask = async () => {
  redirect("/protected/tasks?add");
}

export const openAddTaskAtHome = async () => {
  redirect("/protected/home?add=true");
}

export const closeAddTaskAtHome = async () => {
  redirect("/protected/home");
}

export const setTask = async (form: FormData) => {
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
    revalidatePath("/protected/home");
    revalidatePath("/protected/tasks");
    return { message: "Task added" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong" };
  }
};