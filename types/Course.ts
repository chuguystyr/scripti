import { Schema } from "mongoose"
export default interface Course {
  userId: Schema.Types.ObjectId
  title: string
  teacherLectures: string
  lecturesLink?: string
  teacherPractices: string
  practicesLink?: string
  controlForm: string
  notes?: string
}
