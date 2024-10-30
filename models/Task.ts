import { Model, Schema, model, models } from "mongoose"
import Course from "models/Course"
import ITask from "types/Task"

const TaskSchema = new Schema<ITask, Model<ITask>>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
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
    required: true,
    validate: {
      validator: async (value: Schema.Types.ObjectId) => {
        return (await Course.findById(value)) !== null
      },
    },
  },
  status: {
    type: String,
    enum: ["new", "in progress", "done"],
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
})

const TaskModel: Model<ITask> =
  models.tasks || model<ITask>("tasks", TaskSchema)

export default TaskModel
