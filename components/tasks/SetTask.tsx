"use client"
import { editTask, setTask } from "server/actions/tasks"
import Task, { TaskType } from "types/Task"
import { useActionState } from "react"
const SetTask: React.FC<
  { task: Omit<Task, "userId"> | undefined } & {
    courses: { _id: string; title: string }[]
  }
> = ({ task, courses }) => {
  const [message, formAction, pending] = useActionState(
    task ? editTask : setTask,
    null,
  )
  return (
    <form
      className="w-fit h-fit self-center flex flex-col gap-3"
      action={formAction}
      aria-label={task ? "Edit course form" : "Add course form"}
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
      <select
        name="course"
        id="course"
        className="p-2 border border-gray-300 rounded-md"
        defaultValue={
          courses.find((course) => course.title === task?.course)?._id
        }
      >
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.title}
          </option>
        ))}
      </select>

      <label htmlFor="type" className="font-semibold">
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
      <input hidden readOnly value={task?._id.toString()} name="id" id="id" />
      <input
        hidden
        readOnly
        defaultValue={window.location.href}
        name="location"
        id="location"
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
