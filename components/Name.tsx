import { getAccount } from "server/actions/account"

const Name = async () => {
  const { name } = await getAccount()
  return <h2>Hello, {name}</h2>
}
export default Name
