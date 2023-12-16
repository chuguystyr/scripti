import { protector } from "lib/protection";
import Tasks from "./Tasks";
import { cookies } from "next/headers";
import dbConnect from "lib/db";
import User from "models/User";

const Page = async () => {
  const tasks = await getData();
  return <Tasks tasks={tasks} />;
};

export default Page;

const getData = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  await dbConnect();
  try {
    const result = await User.findOne(
      { _id: userId!.id },
      { _id: 0, tasks: 1 },
    );
    if (result) {
      return result.tasks;
    } else {
      return { message: "No tasks found" };
    }
  } catch (error) {
    return { error: "Something went wrong." };
  }
};