import { Types } from "mongoose"
export default interface Course {
  _id: Types.ObjectId
  userId: Types.ObjectId
  major: string
  title: string
  teacherLectures: string
  lecturesLink?: string
  teacherPractices: string
  practicesLink?: string
  controlForm: string
  notes?: string
}
