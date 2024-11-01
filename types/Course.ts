import { Schema } from "mongoose"
export default interface Course {
  _id: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  title: string
  teacherLectures: string
  lecturesLink?: string
  teacherPractices: string
  practicesLink?: string
  controlForm: string
  notes?: string
}
