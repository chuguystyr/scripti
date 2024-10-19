import SubmitButton from "components/SubmitButton"
import { setTask } from "server/actions/tasks"
import { FaWindowClose } from "react-icons/fa"
import { SearchParams } from "types/Utilities"
const SetTask: React.FC<
  SearchParams & {
    close: () => void
  }
> = ({ close, searchParams }) => {
  let message = ""
  switch (searchParams?.error) {
    case "fields":
      message = `Please fill in\nall required fields`
      break
    case "course":
      message = `No such course exists`
      break
    case "date":
      message = `Can't add task that's already overdue`
      break
    case "title":
      message = `Task with this title and course\nalready exists`
      break
  }
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full flex flex-col justify-center content-center">
      <form action={close} className="self-center z-40">
        <button type="submit">
          <FaWindowClose />
        </button>
      </form>
      <form
        className="w-fit h-fit self-center flex flex-col bg-white rounded-md shadow-lg p-5 gap-3"
        action={setTask}
      >
        {searchParams?.error && (
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
        />

        <label htmlFor="course" className="font-semibold">
          Course
        </label>
        <input
          type="text"
          name="course"
          id="course"
          className="p-2 border border-gray-300 rounded-md"
        />

        <label htmlFor="date" className="font-semibold">
          Deadline
        </label>
        <input
          type="date"
          name="date"
          id="date"
          className="p-2 border border-gray-300 rounded-md"
        />

        <label htmlFor="description" className="font-semibold">
          Description
        </label>
        <input
          type="text"
          name="description"
          id="description"
          className="p-2 border border-gray-300 rounded-md"
        />

        <SubmitButton text="Save" />
      </form>
    </div>
  )
}

export default SetTask
