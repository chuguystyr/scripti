"use client"
import { editTask, setTask } from "server/actions/tasks"
import Task, { TaskType } from "types/Task"
import { useActionState } from "react"
const SetTask: React.FC<{ task: Omit<Task, "userId"> | undefined }> = ({
  task,
}) => {
  const [message, formAction, pending] = useActionState(
    task ? editTask : setTask,
    null,
  )
  return (
    <form
      className="w-fit h-fit self-center flex flex-col gap-3"
      action={formAction}
    >
      {message && (
        <p className="text-center w-[15vw] block mx-auto text-red-500">
          {message}
        </p>
      )}
      <label htmlFor="title" className="font-semibold">
        Title
      </label>
      <input
        type="text"
        name="title"
        id="title"
        className="p-2 border border-gray-300 rounded-md"
        defaultValue={task?.title}
      />

      <label htmlFor="course" className="font-semibold">
        Course
      </label>
      <input
        type="text"
        name="course"
        id="course"
        className="p-2 border border-gray-300 rounded-md"
        defaultValue={task?.course.toString()}
      />

      <label htmlFor="priority" className="font-semibold">
        Type
      </label>

      <select
        name="type"
        id="type"
        className="p-2 border border-gray-300 rounded-md"
        defaultValue={task?.type}
      >
        {Object.values(TaskType).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <label htmlFor="date" className="font-semibold">
        Deadline
      </label>
      <input
        type="date"
        name="date"
        id="date"
        className="p-2 border border-gray-300 rounded-md"
        defaultValue={task?.deadline.toISOString().split("T")[0]}
      />

      <label htmlFor="description" className="font-semibold">
        Description
      </label>
      <input
        type="text"
        name="description"
        id="description"
        className="p-2 border border-gray-300 rounded-md"
        defaultValue={task?.description}
      />
      <button
        type="submit"
        className="btn-filled block mx-auto"
        disabled={pending}
      >
        {pending ?
          "Submitting..."
        : task ?
          "Save Changes"
        : "Add Task"}
      </button>
    </form>
  )
}

export default SetTask
