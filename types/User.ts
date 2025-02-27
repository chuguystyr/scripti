import { Types } from "mongoose"

export interface IUser {
  _id: Types.ObjectId | string
  name: string
  username: string
  email: string
  password: string
  majors: string[]
}

export type UserBasicInfo = Omit<
  IUser,
  "schedules " | "password" | "_id" | "majors"
>
