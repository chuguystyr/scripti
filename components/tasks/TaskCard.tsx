import { RiDeleteBin7Fill } from "react-icons/ri"
import Task from "types/Task"
import { deleteTask } from "server/actions/tasks"
import EditLink from "components/EditLink"
import { AiFillFire } from "react-icons/ai"
import { RxDividerVertical } from "react-icons/rx"
import TaskStatusSwitcher from "components/tasks/TaskStatusSwitcher"

const TaskCard: React.FC<Task> = async ({
  _id,
  title,
  course,
  status,
  deadline,
  description,
}) => {
  const date =
    new Date(deadline) <= new Date() ?
      <AiFillFire className="inline text-amber-500" />
    : new Date(deadline).toLocaleString("ua-UK", {
        day: "2-digit",
        month: "2-digit",
      })
  return (
    <div className="card flex flex-col gap-2 p-4 h-fit">
      <div className="flex justify-between">
        <h1 className="font-bold w-3/4">{title}</h1>
        <EditLink _id={_id.toString()} itemType="task" />
        <TaskStatusSwitcher _id={_id.toString()} status={status} />
        <form action={deleteTask}>
          <input type="hidden" name="id" value={_id?.toString()} />
          <button>
            <RiDeleteBin7Fill className="inline cursor-pointer self-center" />
          </button>
        </form>
      </div>
      <h2>
        <span className="font-mono">{date}</span>
        <RxDividerVertical className="inline" />
        <span>{course as string}</span>
        <RxDividerVertical className="inline" />
        <span className="font-serif">{status}</span>
      </h2>
      <p className="line-clamp-1 md:line-clamp-4">{description}</p>
    </div>
  )
}

export default TaskCard
