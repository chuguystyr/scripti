import Schedule from "types/Schedule"
import { Types } from "mongoose"

export default interface IUser {
  _id: Types.ObjectId
  name: string
  username: string
  email: string
  password: string
  schedules?: Schedule[]
  majors: string[]
}
