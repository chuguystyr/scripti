import { Types } from "mongoose"

export default interface Task {
  _id: Types.ObjectId | string
  userId: Types.ObjectId | string
  title: string
  deadline: Date
  course: Types.ObjectId | string
  status: string
  description?: string
}
