import { FaWindowClose } from "react-icons/fa"
import Link from "next/link"
import ChangePasswordForm from "components/account/ChangePasswordForm"

const ChangePasswordModal = () => {
  return (
    <Modal>
      <ChangePasswordForm />
    </Modal>
  )
}
export default ChangePasswordModal

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
