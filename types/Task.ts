import { Schema } from "mongoose"

export default interface Task {
  userId: Schema.Types.ObjectId
  title: string
  deadline: Date
  course: Schema.Types.ObjectId
  status: string
  description?: string
}
