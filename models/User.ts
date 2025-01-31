import { Schema, model } from "mongoose"
import { IUser, IUserModel } from "types/User"
// TODO: add necessary statics, methods and query helpers
const userSchema = new Schema<IUser, IUserModel>(
  {
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
  },
  {
    statics: {
      async findNameById(id: string): Promise<string | null> {
        const user = await this.findById(id, { name: 1, _id: 0 }).lean()
        return user?.name || null
      },
    },
  },
)

const UserModel = model<IUser, IUserModel>("users", userSchema)

export default UserModel
