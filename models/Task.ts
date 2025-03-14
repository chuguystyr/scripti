import { Model, Schema, model, models } from "mongoose"
import Course from "models/Course"
import ITask, { TaskStatus, TaskType } from "types/Task"
// TODO: add necessary statics, methods and query helpers
const TaskSchema = new Schema<ITask, Model<ITask>>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: TaskType,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: (value: Date) => {
        return value >= new Date()
      },
      message: "Can't add task that's already overdue",
    },
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "courses",
    required: true,
    validate: {
      validator: async (value: Schema.Types.ObjectId) => {
        return (await Course.findById(value)) !== null
      },
    },
  },
  status: {
    type: String,
    enum: TaskStatus,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
})
TaskSchema.index({ userId: 1 })
TaskSchema.index({ course: 1, title: 1 }, { unique: true })
const TaskModel: Model<ITask> =
  models.tasks || model<ITask>("tasks", TaskSchema)

export default TaskModel
