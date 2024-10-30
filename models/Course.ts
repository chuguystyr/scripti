import { Schema, Model, model, models } from "mongoose"
import ICourse from "types/Course"

const CourseSchema = new Schema<ICourse, Model<ICourse>>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => value.length > 0,
    },
    unique: true,
  },
  teacherLectures: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => value.length > 0,
    },
  },
  lecturesLink: {
    type: String,
    required: false,
  },
  teacherPractices: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => value.length > 0,
    },
  },
  practicesLink: {
    type: String,
    required: false,
  },
  controlForm: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => value.length > 0,
    },
  },
  notes: {
    type: String,
    required: false,
  },
})

const CourseModel: Model<ICourse> =
  models.courses || model<ICourse>("courses", CourseSchema)

export default CourseModel
