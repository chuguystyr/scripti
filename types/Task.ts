import { Schema } from "mongoose"

export default interface Task {
  _id: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  title: string
  deadline: Date
  course: Schema.Types.ObjectId
  status: string
  description?: string
}
