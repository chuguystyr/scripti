import User from "models/User"
import { protector } from "server/protection"
import dbConnect from "server/db"

const Name = async () => {
  const id = await protector()
  await dbConnect()
  const name = await User.findNameById(id)
  return <h2>Hello, {name}</h2>
}
export default Name
