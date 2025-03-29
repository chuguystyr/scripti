import Modal from "components/Modal"
import SetTask from "components/tasks/SetTask"
import Course from "models/Course"
import User from "models/User"
import { protector } from "server/protection"
import { Params } from "types/Utilities"
import dbConnect from "server/db"

const CreateTaskModal: React.FC<Params> = async ({ params }) => {
  const { major } = await params
  const id = await protector()
  await dbConnect()
  const { majors } = await User.findById(id, { majors: 1 }).lean().orFail()
  const courses = await Course.find(
    { userId: id, major: majors[+major] },
    { title: 1, _id: { $toString: "$_id" } },
  )
    .lean<{ _id: string; title: string }[]>()
    .orFail()
  return (
    <Modal>
      <SetTask task={undefined} courses={courses} />
    </Modal>
  )
}
export default CreateTaskModal
