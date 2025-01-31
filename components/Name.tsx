import User from "models/User"
import { protector } from "server/protection"

const Name = async () => {
  const id = await protector()
  const name = await User.findNameById(id)
  return <h2>Hello, {name}</h2>
}
export default Name
