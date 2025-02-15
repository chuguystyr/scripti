import { FaCheckCircle, FaEdit } from "react-icons/fa"
import { RiDeleteBin7Fill } from "react-icons/ri"
import Task from "types/Task"
import { checkTask, deleteTask } from "server/actions/tasks"
import Link from "next/link"

const TaskCard: React.FC<Task> = async ({
  _id,
  title,
  course,
  status,
  deadline,
  description,
}) => {
  return (
    <div className="card flex flex-col gap-2 p-4 h-fit">
      <div className="flex justify-between">
        <h1 className="font-bold w-3/4">{title}</h1>
        <Link
          href={`/protected/tasks/0/edit/${_id}`}
          className="flex items-center"
          scroll={false}
        >
          <FaEdit />
        </Link>
        <form action={checkTask}>
          <input type="hidden" name="id" value={_id?.toString()} />
          <button>
            <FaCheckCircle className="inline cursor-pointer self-center" />
          </button>
        </form>
        <form action={deleteTask}>
          <input type="hidden" name="id" value={_id?.toString()} />
          <button>
            <RiDeleteBin7Fill className="inline cursor-pointer self-center" />
          </button>
        </form>
      </div>
      <h2>
        <span className="font-mono">
          {new Date(deadline).toLocaleString("ua-UK", {
            day: "2-digit",
            month: "2-digit",
          })}
        </span>{" "}
        | <span>{course as string}</span> |{" "}
        <span className="font-serif">{status}</span>
      </h2>
      <p className="line-clamp-1 md:line-clamp-4">{description}</p>
    </div>
  )
}

export default TaskCard
