import { Date, ObjectId, Types } from "mongoose"

export enum DaysOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export const DaysOfWeekArray = [
  DaysOfWeek.Sunday,
  DaysOfWeek.Monday,
  DaysOfWeek.Tuesday,
  DaysOfWeek.Wednesday,
  DaysOfWeek.Thursday,
  DaysOfWeek.Friday,
  DaysOfWeek.Saturday,
] as const

export enum CourseType {
  Lecture = "Lecture",
  Practice = "Practice",
}

export type ScheduleDay = Record<string, ScheduleItem> & {
  _id: string | Types.ObjectId
}

export type Schedule = {
  _id: ObjectId | string
  userId: ObjectId | string
  major: string
  till: Date
  from: Date
  times: string[]
} & {
  [key in DaysOfWeek]?: ScheduleDay
}

export type ScheduleItem = {
  course: ObjectId | string
  type: CourseType
  room?: string
  teacher?: string
  link?: string
}
