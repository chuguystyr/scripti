import Modal from "components/Modal"
import SetTask from "components/tasks/SetTask"

const CreateTaskModal: React.FC = () => {
  return (
    <Modal>
      <SetTask task={undefined} />
    </Modal>
  )
}
export default CreateTaskModal
