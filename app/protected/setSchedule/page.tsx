// "use server";
// import SetSchedule from "app/protected/setSchedule/SetSchedule";
// import { getCourses } from "../courses/page";
// import { protector } from "lib/protection";
// import { cookies } from "next/headers";
// import User from "models/User";

// const Page = async () => {
//   const courses = (await getCourses()) as { title: string }[];
//   return <SetSchedule courses={courses} />;
// };

// export default Page;

// export const setSchedule = async (prevState: any, form: FormData) => {
//   const formData = Object.fromEntries(form.entries()) as {
//     [key: string]: string;
//   };
//   if (
//     formData["from"] !== "" &&
//     formData["to"] !== "" &&
//     formData["from"] < formData["to"] &&
//     formData["from"] >
//       new Date().toLocaleDateString("de-DE", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       })
//   ) {
//     const user = await protector(cookies().get("_scrpt")!.value);
//     if (user.hasOwnProperty("message")) {
//       return { message: "Unathorised" };
//     }
//     const userId = user as { id: string };
//     const schedule = transformData(formData);
//     try {
//       const result = await User.findOneAndUpdate(
//         { _id: userId.id },
//         { $push: { schedules: schedule } },
//         { new: true },
//       );
//       if (result) {
//         return { message: "Schedule set successfully" };
//       } else {
//         return { error: "Something went wrong." };
//       }
//     } catch (error) {
//       return { error: "Something went wrong." };
//     }
//   } else {
//     return { error: "Invalid data." };
//   }
// };

// function transformData(input: { [key: string]: string }) {
//   const schedule = JSON.parse(input.inputsData);
//   const transformed: { [key: string]: { [key: string]: {} } } = {};
//   Object.keys(schedule).forEach((key) => {
//     const match = key.match(/(^[a-zA-Z]+)(\d+)/);
//     if (match) {
//       const day = match[1];
//       const index = match[2];
//       if (schedule[key].course === "") {
//         return;
//       }
//       if (!transformed[day]) {
//         transformed[day] = {};
//       }
//       transformed[day][index] = schedule[key];
//     }
//   });
//   return { ...transformed, to: input.to, from: input.from };
// }

const Page:React.FC<{}> = () => {
    return <div></div>;
  }
  
  export default Page;