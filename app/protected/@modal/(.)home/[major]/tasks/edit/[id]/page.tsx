import Modal from "components/Modal"
import SetTask from "components/tasks/SetTask"
import Course from "models/Course"
import Task from "models/Task"
import User from "models/User"
import dbConnect from "server/db"
import { protector } from "server/protection"

const EditTaskModal: React.FC<{
  params: Promise<{ id: string; major: string }>
}> = async ({ params }) => {
  const { id, major } = await params
  const userId = await protector()
  await dbConnect()
  const { majors } = await User.findById(userId, { majors: 1 }).lean().orFail()
  const courses = await Course.find(
    { userId: userId, major: majors[+major] },
    { title: 1, _id: { $toString: "$_id" } },
  )
    .lean<{ _id: string; title: string }[]>()
    .orFail()
  const task = await Task.findById(id, { userId: 0 })
    .populate({ path: "course", select: "title" })
    .lean()
    .then((task) => {
      if (task?.course)
        return {
          ...task,
          course: (task.course as unknown as { title: string }).title,
          _id: task._id.toString(),
        }
    })
  return (
    <Modal>
      <SetTask task={task} courses={courses} />
    </Modal>
  )
}
export default EditTaskModal
