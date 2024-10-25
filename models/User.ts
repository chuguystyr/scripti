import { Model, Schema, model, models } from "mongoose"
import IUser from "types/User"

const userSchema = new Schema<IUser, Model<IUser>>({
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

const UserModel: Model<IUser> =
  models.users || model<IUser>("users", userSchema)

export default UserModel
