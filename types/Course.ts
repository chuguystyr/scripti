import { Types } from "mongoose"
export default interface Course {
  _id: Types.ObjectId | string
  userId: Types.ObjectId | string
  major: string
  title: string
  type: CourseType
  teacherLectures: string
  lecturesLink?: string
  teacherPractices: string
  practicesLink?: string
  controlForm: ControlForm
  notes?: string
}

export enum CourseType {
  CORE = "core",
  MAJOR_ELECTIVE = "major elective",
  FREE_ELECTIVE = "free elective",
}

export enum ControlForm {
  CREDIT = "credit",
  EXAM = "exam",
  EXAM_WITH_PAPER = "exam with paper",
}
