import SetCourse from "components/courses/SetCourse"
import Modal from "components/Modal"
import Course from "models/Course"
import dbConnect from "server/db"

const EditCourseModal: React.FC<{ params: Promise<{ id: string }> }> = async ({
  params,
}) => {
  const { id } = await params
  await dbConnect()
  const course = await Course.findById(id, { userId: 0 }).lean().orFail()
  return (
    <Modal>
      <SetCourse
        course={{
          ...course,
          _id: course._id.toString(),
        }}
      />
    </Modal>
  )
}
export default EditCourseModal
