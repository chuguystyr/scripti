import SetCourse from "components/courses/SetCourse"
import Link from "next/link"
import { FaWindowClose } from "react-icons/fa"
import { Params } from "types/Utilities"

const CreateCourseModal: React.FC<Params> = async ({ params }) => {
  const { major } = await params
  return (
    <Modal>
      <SetCourse major={major} />
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
          href="/protected/0/courses"
        >
          <FaWindowClose />
        </Link>
        {children}
      </div>
    </div>
  )
}
