import EditAccountInfoForm from "components/account/EditAccountInfoForm"
import User from "models/User"
import { protector } from "server/protection"
import dbConnect from "server/db"
import Modal from "components/Modal"

const EditAccountModal = async () => {
  const id = await protector()
  await dbConnect()
  const user = await User.findProfileDetailsById(id)
  return (
    <Modal>
      <EditAccountInfoForm {...user} />
    </Modal>
  )
}
export default EditAccountModal
