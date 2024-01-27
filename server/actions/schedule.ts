"use server";

import dbConnect from "server/db";
import User from "models/User";
import { cookies } from "next/headers";
import { protector } from "server/protection";
import Schedule from "types/Schedule";
export const getSchedule = async () => {
  const user = await protector(cookies().get("_scrpt")!.value);
  const { id } = user;
  const date = new Date();
  const day = date.toLocaleDateString("uk-UA", { weekday: "long" });
  try {
    await dbConnect();
    // TODO: add types
    const result = await User.aggregate([
      { $match: { _id: id } },
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
        },
      },
      {
        $project: {
          _id: 0,
          schedule: {
            $arrayToObject: "$schedule",
          },
        },
      },
    ]);
    if (result.length === 0) {
      return { schedule: null };
    } else {
      return result[0].schedule;
    }
  } catch (err) {
    console.log(err);
    throw new Error("Internal");
  }
};
