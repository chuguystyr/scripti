import Schedule from "types/Schedule"
import { Types } from "mongoose"

export interface IUser {
  _id: Types.ObjectId | string
  name: string
  username: string
  email: string
  password: string
  schedules?: Schedule[]
  majors: string[]
}

export type UserBasicInfo = Omit<
  IUser,
  "schedules " | "password" | "_id" | "majors"
>
