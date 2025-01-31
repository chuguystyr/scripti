import EditAccountInfoForm from "components/account/EditAccountInfoForm"
import User from "models/User"
import { protector } from "server/protection"
import dbConnect from "server/db"
import { FaWindowClose } from "react-icons/fa"
import Link from "next/link"

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

const Modal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="relative bg-white p-6 mx-2 rounded-lg shadow-lg">
        <Link
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          href="/protected/account"
        >
          <FaWindowClose />
        </Link>
        {children}
      </div>
    </div>
  )
}
