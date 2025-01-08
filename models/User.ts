import { Model, Schema, model, models } from "mongoose"
import { IUser } from "types/User"
// TODO: add necessary statics, methods and query helpers
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  majors: {
    type: [String],
    required: true,
  },
})

const UserModel: Model<IUser> =
  models.users || model<IUser>("users", userSchema)

export default UserModel
