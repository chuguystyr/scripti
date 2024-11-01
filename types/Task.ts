import { Types } from "mongoose"

export default interface Task {
  _id: Types.ObjectId
  userId: Types.ObjectId
  title: string
  deadline: Date
  course: Types.ObjectId
  status: string
  description?: string
}
