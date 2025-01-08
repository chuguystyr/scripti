import { model, Model, models, Schema } from "mongoose"
import type { Schedule, ScheduleItem } from "types/Schedule"
import { DaysOfWeek, CourseType } from "types/Schedule"
// TODO: add necessary statics, methods and query helpers
const ScheduleItemSchema = new Schema<ScheduleItem, Model<ScheduleItem>>(
  {
    course: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: CourseType, required: true },
    room: { type: String },
    teacher: { type: String },
    link: { type: String },
  },
  { _id: false },
)

const daySchema = {
  type: Map,
  of: ScheduleItemSchema,
  required: false,
}

const ScheduleSchema = new Schema<Schedule, Model<Schedule>>({
  userId: { type: Schema.Types.ObjectId, required: true },
  major: { type: String, required: true },
  till: { type: Date, required: true },
  from: { type: Date, required: true },
  times: { type: [String], required: true },
  // TODO: find a more generalzed aproach
  [DaysOfWeek.Monday]: daySchema,
  [DaysOfWeek.Tuesday]: daySchema,
  [DaysOfWeek.Wednesday]: daySchema,
  [DaysOfWeek.Thursday]: daySchema,
  [DaysOfWeek.Friday]: daySchema,
  [DaysOfWeek.Saturday]: daySchema,
  [DaysOfWeek.Sunday]: daySchema,
})

const ScheduleModel: Model<Schedule> =
  models.schedules || model<Schedule>("schedules", ScheduleSchema)

export default ScheduleModel
