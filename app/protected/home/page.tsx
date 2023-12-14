import { protector } from "lib/protection";
import User from "models/User";
import Home from "app/protected/home/Home";
import { cookies } from "next/headers";

type HomeData = {
  name: string;
  done: number;
  schedule: {
    [key: string]: {
      course: string;
      type: string;
      teacher: string;
      link: string;
      room: string;
      lecturesLink: string;
      practicesLink: string;
      teacherLectures: string;
      teacherPractices: string;
    };
  };
  tasks: Array<{
    title: string;
    date: string;
    course: string;
    status: string;
    description: string;
    id: string;
  }>;
};

const getData = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  if (user.hasOwnProperty("message")) {
    return { message: "Unathorised" };
  }
  const userId = user as { id: string };
  const date = new Date();
  const day = date.toLocaleDateString("uk-UA", { weekday: "long" });
  try {
    const result = await User.aggregate([
      { $match: { _id: userId.id } },
      { $unwind: "$schedules" },
      {
        $match: {
          $and: [
            { "schedules.from": { $lte: new Date().toLocaleDateString("de") } },
            { "schedules.to": { $gte: new Date().toLocaleDateString("de") } },
          ],
        },
      },
      {
        $addFields: {
          currentDaySchedule: day,
        },
      },
      {
        $project: {
          schedule: {
            $map: {
              input: { $objectToArray: "$currentDaySchedule" },
              as: "day",
              in: {
                k: "$$day.k",
                v: {
                  $mergeObjects: [
                    "$$day.v",
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$courses",
                            as: "course",
                            cond: { $eq: ["$$course.title", "$$day.v.course"] },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
          _id: 0,
          name: 1,
          done: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $eq: ["$$task.status", "done"] },
              },
            },
          },
          tasks: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $ne: ["$$task.status", "done"] },
            },
          },
        },
      },
      {
        $project: {
          schedule: {
            $arrayToObject: "$schedule",
          },
          tasks: 1,
          name: 1,
          done: 1,
        },
      },
    ]);
    if (result.length === 0) {
      const user = await User.findOne({ _id: userId.id }, { _id: 0, name: 1 });
      if (!user) return { message: "Did not find user" };
      const data = {
        schedule: null,
        tasks: [],
        done: 0,
        name: user.name,
      };
      return data;
    } else {
      const data = {
        schedule: result[0].schedule,
        tasks: result[0].tasks,
        name: result[0].name,
        done: result[0].done,
      };
      return data;
    }
  } catch (err) {
    console.log(err);
    return { message: "Something went wrong" };
  }
};

const getQuote = async () => {
  const response = await fetch("https://api.quotable.io/random");
  const data = await response.json();
  return { text: data.content, author: data.author };
};

const Page = async () => {
  const data = await getData();
  if (data.hasOwnProperty("message")) {
    const { message } = data as { message: string };
    return { message };
  }
  const { text, author } = await getQuote();
  return <Home data={data as HomeData} quote={{ text, author }} />;
};

export default Page;
