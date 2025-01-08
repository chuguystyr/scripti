import { Schema, Model, model, models } from "mongoose"
import ICourse from "types/Course"
// TODO: add necessary statics, methods and query helpers
const CourseSchema = new Schema<ICourse, Model<ICourse>>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  major: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => value.length > 0,
    },
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

CourseSchema.index({ userId: 1, major: 1 })
CourseSchema.index({ userId: 1, major: 1, title: 1 }, { unique: true })

const CourseModel: Model<ICourse> =
  models.courses || model<ICourse>("courses", CourseSchema)

export default CourseModel
