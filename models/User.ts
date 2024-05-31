import { Schema, model, models } from "mongoose"
import { unique } from "node_modules/cypress/types/jquery"

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
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

const UserModel = models.users || model("users", UserSchema)

export default UserModel
