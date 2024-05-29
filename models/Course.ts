import { Schema, model, models } from "mongoose"

const CourseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  teacherLectures: {
    type: String,
    required: true,
  },
  lecturesLink: {
    type: String,
    required: false,
  },
  teacherPractices: {
    type: String,
    required: true,
  },
  practicesLink: {
    type: String,
    required: false,
  },
  controlForm: {
    type: String,
    required: true,
  },
})

const CourseModel = models.courses || model("courses", CourseSchema)

export default CourseModel
