import SetCourse from "components/courses/SetCourse"
import Modal from "components/Modal"
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
