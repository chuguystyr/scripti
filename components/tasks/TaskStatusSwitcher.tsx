import { FaCheckCircle } from "react-icons/fa"
import { IoIosConstruct } from "react-icons/io"
import { BiReset } from "react-icons/bi"
import {
  checkTask,
  makeInProgress,
  resetTaskStatus,
} from "server/actions/tasks"
import { TaskStatus } from "types/Task"

const TaskStatusSwitcher: React.FC<{ _id: string; status: string }> = ({
  _id,
  status,
}) => {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return (
        <form action={checkTask}>
          <input type="hidden" name="id" value={_id?.toString()} />
          <button>
            <FaCheckCircle className="inline cursor-pointer self-center" />
          </button>
        </form>
      )
    case TaskStatus.NEW:
      return (
        <form action={makeInProgress}>
          <input type="hidden" name="id" value={_id?.toString()} />
          <button>
            <IoIosConstruct className="inline cursor-pointer self-center" />
          </button>
        </form>
      )
    case TaskStatus.DONE:
      return (
        <form action={resetTaskStatus}>
          <input type="hidden" name="id" value={_id?.toString()} />
          <button>
            <BiReset className="inline cursor-pointer self-center" />
          </button>
        </form>
      )
    default:
      return null
  }
}

export default TaskStatusSwitcher
