import { Model, Types } from "mongoose"

export interface IUser {
  _id: Types.ObjectId | string
  name: string
  username: string
  email: string
  password: string
  majors: string[]
}

export type UserProfileInfo = Omit<
  IUser,
  "schedules " | "password" | "_id" | "majors"
>
export interface IUserModel extends Model<IUser> {
  findNameById(id: string): Promise<string>
  findProfileDetailsById(id: string): Promise<UserProfileInfo>
}
