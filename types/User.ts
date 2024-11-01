import Course from "types/Course"
import Task from "types/Task"
import Schedule from "types/Schedule"
import { Types } from "mongoose"

export default interface IUser {
  _id: Types.ObjectId
  name: string
  username: string
  email: string
  password: string
  courses?: Course[]
  schedules?: Schedule[]
  tasks?: Task[]
}
