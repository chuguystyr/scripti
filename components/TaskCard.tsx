"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaWindowClose, FaCheckCircle } from "react-icons/fa";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { editTask, checkTask, deleteTask } from "lib/serverActions";
import { useFormState } from "react-dom";
interface Props {
  title: string;
  date: string;
  course: string;
  status: string;
  description: string;
  id: string;
}
// TODO: rewrite
const TaskCard = (props: Props) => {
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [data, setData] = useState<Props>(props);
  const [state, formAction] = useFormState(editTask, { message: "" });
  useEffect(() => {
    if (state.message) {
      setEditable(false);
      router.refresh();
    }
  }, [state, router]);
  return (
    <div className="card w-fit h-fit">
      {!editable ?
        <>
          <div className="flex justify-between">
            <h1 className="font-bold mr-[4vw]">{props.title}</h1>
            <FaEdit
              className="inline cursor-pointer self-center"
              onClick={() => setEditable(true)}
            />
            <FaCheckCircle
              className="inline cursor-pointer self-center"
              onClick={() => {
                checkTask(props.id);
                router.refresh();
              }}
            />
            <RiDeleteBin7Fill
              className="inline cursor-pointer self-center"
              onClick={() => {
                deleteTask(props.id);
                router.refresh();
              }}
            />
          </div>
          <h2>
            <span className="font-mono">{props.date}</span> |{" "}
            <span>{props.course}</span> |{" "}
            <span className="font-serif">{props.status}</span>
          </h2>
          <p>{props.description}</p>
        </>
      : <form
          method="post"
          action={formAction}
          className="bg-white rounded shadow"
        >
          <FaWindowClose
            className="cursor-pointer block mx-auto mb-1 text-gray-600 hover:text-gray-800"
            onClick={() => setEditable(false)}
          />
          <div className="flex flex-col items-center space-y-2">
            <input
              className="text-center font-bold p-2 rounded border border-gray-300 w-full"
              type="text"
              placeholder="Task Title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
            <input
              className="p-2 rounded border border-gray-300 w-full"
              type="date"
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />
            <input
              className="text-center p-2 rounded border border-gray-300 w-full"
              type="text"
              placeholder="Course"
              value={data.course}
              onChange={(e) => setData({ ...data, course: e.target.value })}
            />

            <select
              className="p-2 rounded border border-gray-300 w-full text-center"
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value })}
            >
              <option value="new">New</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <textarea
              className="p-2 rounded border border-gray-300 w-full"
              placeholder="Description"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            ></textarea>
            <input type="text" name="id" hidden value={data.id} />
            <button
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-all duration-500"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      }
    </div>
  );
};

export default TaskCard;
