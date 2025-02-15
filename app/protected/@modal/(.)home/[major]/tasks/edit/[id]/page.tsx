import Modal from "components/Modal"
import SetTask from "components/tasks/SetTask"
import Task from "models/Task"
import dbConnect from "server/db"

const EditTaskModal: React.FC<{ params: Promise<{ id: string }> }> = async ({
  params,
}) => {
  const { id } = await params
  await dbConnect()
  const task = await Task.findById(id, { userId: 0 }).lean().orFail()
  return (
    <Modal>
      <SetTask task={task} />
    </Modal>
  )
}
export default EditTaskModal
