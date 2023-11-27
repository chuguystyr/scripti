import { protector } from "@/lib/protection";
import Account from "./Account";
import { cookies } from "next/headers";
import User from "@/models/User";

const getData = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  try {
  const result = await User.findOne({ _id: userId.id }, { _id: 0, name: 1, email: 1, username: 1 })
  if (result) {
    return result;
  }
  return { message: "Something went wrong" };
} catch (error) {
  return { message: "Something went wrong" };
}
};

export default async () => {
  const data = await getData();
  return <Account data={data} />;
};