import { FaEdit, FaWindowClose, FaCheckCircle } from "react-icons/fa";
import { RiDeleteBin7Fill } from "react-icons/ri";
import Task from "types/Task";
import { checkTask, deleteTask, editTask } from "server/actions/tasks";

const TaskCard: React.FC<{
  task: Task;
  searchParams?: { [key: string]: string | string[] | undefined };
  setEditable: () => Promise<never>;
  resetEditable: () => Promise<never>;
}> = ({ task, searchParams, setEditable, resetEditable }) => {
  return (
    <div className="card w-fit h-fit">
      {!searchParams?.edit ?
        <>
          <div className="flex justify-between">
            <h1 className="font-bold mr-[4vw]">{task.title}</h1>
            <form action={setEditable}>
              <button type="submit">
                <FaEdit className="inline cursor-pointer self-center" />
              </button>
            </form>
            <form action={checkTask}>
              <input type="hidden" name="id" value={task.id} />
              <button>
                <FaCheckCircle className="inline cursor-pointer self-center" />
              </button>
            </form>
            <form action={deleteTask}>
              <input type="hidden" name="id" value={task.id} />
              <button>
                <RiDeleteBin7Fill className="inline cursor-pointer self-center" />
              </button>
            </form>
          </div>
          <h2>
            <span className="font-mono">{task.date}</span> |{" "}
            <span>{task.course}</span> |{" "}
            <span className="font-serif">{task.status}</span>
          </h2>
          <p>{task.description}</p>
        </>
      : <>
          <form action={resetEditable} className="w-fit mx-auto">
            <button type="submit">
              <FaWindowClose className="cursor-pointer block mx-auto mb-1 text-gray-600 hover:text-gray-800" />
            </button>
          </form>
          <form
            method="post"
            action={editTask}
            className="bg-white rounded shadow"
          >
            <div className="flex flex-col items-center space-y-2">
              <input
                className="text-center font-bold p-2 rounded border border-gray-300 w-full"
                type="text"
                placeholder="Task Title"
                defaultValue={task.title}
              />
              <input
                className="p-2 rounded border border-gray-300 w-full"
                type="date"
                defaultValue={task.date}
              />
              <input
                className="text-center p-2 rounded border border-gray-300 w-full"
                type="text"
                placeholder="Course"
                defaultValue={task.course}
              />

              <select
                className="p-2 rounded border border-gray-300 w-full text-center"
                defaultValue={task.status}
              >
                <option value="new">New</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <textarea
                className="p-2 rounded border border-gray-300 w-full"
                placeholder="Description"
                defaultValue={task.description}
              ></textarea>
              <input type="text" name="id" hidden value={task.id} />
              <button
                className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-all duration-500"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </>
      }
    </div>
  );
};

export default TaskCard;
