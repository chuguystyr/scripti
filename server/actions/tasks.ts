"use server";

import dbConnect from "server/db";
import User from "models/User";
import { cookies } from "next/headers";
import { protector } from "server/protection";
import { ObjectId } from "mongodb";
import Task from "types/Task";

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
      return result.tasks;
    } else {
      return { message: "No tasks found" };
    }
  } catch (error) {
    return { error: "Something went wrong." };
  }
};
