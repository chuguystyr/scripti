import { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  courses: {
    type: Array,
    required: false,
  },
  schedules: {
    type: Array,
    required: false,
  },
  tasks: {
    type: Array,
    required: false,
  },
})

const UserModel = models.user || model("users", UserSchema)

export default UserModel
