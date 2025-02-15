import SetTask from "components/tasks/SetTask"
import Link from "next/link"
import { FaWindowClose } from "react-icons/fa"

const CreateCourseModal: React.FC = () => {
  return (
    <Modal>
      <SetTask task={undefined} />
    </Modal>
  )
}
export default CreateCourseModal

const Modal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="relative bg-white p-6 mx-2 rounded-lg shadow-lg">
        <Link
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          href="/protected/home/0"
        >
          <FaWindowClose />
        </Link>
        {children}
      </div>
    </div>
  )
}
