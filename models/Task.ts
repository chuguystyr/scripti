import { Schema, model, models } from "mongoose"
import Course from "models/Course"

const TaskSchema = new Schema({
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
    validator: (value: Date) => {
      return value >= new Date()
    },
  },
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    validator: async (value: Schema.Types.ObjectId) => {
      return (await Course.findById(value)) !== null
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

TaskSchema.pre("validate", async function (next) {
  const task = this
  const course = await Course.findById(task.course)
  if (!course) {
    console.log(`Validation failed: Course with ID ${task.course} not found`)
    task.invalidate("course", "Course not found")
  }
  next()
})

const TaskModel = models.tasks || model("tasks", TaskSchema)

export default TaskModel
