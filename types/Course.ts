import { Types } from "mongoose"
export default interface Course {
  _id: Types.ObjectId | string
  userId: Types.ObjectId | string
  major: string
  title: string
  teacherLectures: string
  lecturesLink?: string
  teacherPractices: string
  practicesLink?: string
  controlForm: string
  notes?: string
}
