import Modal from "components/Modal"
import Link from "next/link"
import { useState } from "react"
import { useActionState } from "react"
import { FaEdit } from "react-icons/fa"
import { RiDeleteBin7Fill } from "react-icons/ri"
import { editCourse, deleteCourse } from "server/actions/courses"
import Course from "types/Course"

const CourseCard: React.FC<Course> = (course) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, formAction, pending] = useActionState(editCourse, null)
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-center text-lg font-bold mb-3 w-4/5">
          {course.title}
        </h2>
        <form
          className="inline-block cursor-pointer"
          action={() => setIsModalOpen(true)}
        >
          <button type="submit">
            <FaEdit />
          </button>
        </form>
        <form action={deleteCourse} className="cursor-pointer">
          <input
            type="text"
            name="id"
            value={course._id.toString()}
            hidden
            readOnly
          />
          <button type="submit">
            <RiDeleteBin7Fill />
          </button>
        </form>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="block mx-auto font-mono font-semibold">
          {course.controlForm}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_2fr_0.5fr] gap-2 mb-2">
        <span>Lectures</span>
        <span>{course.teacherLectures}</span>
        <Link
          href={course?.lecturesLink || "#"}
          className="text-blue-600 hover:text-blue-800"
        >
          Link
        </Link>
      </div>
      <div className="grid grid-cols-[1fr_2fr_0.5fr] gap-2 mb-2">
        <span>Practices</span>
        <span>{course.teacherPractices}</span>
        <Link
          href={course?.practicesLink || "#"}
          className="text-blue-600 hover:text-blue-800"
        >
          Link
        </Link>
      </div>
      {course.notes && (
        <div className="grid grid-cols-[1fr_2fr_0.5fr] gap-2 mb-2">
          <span>Notes</span>
          <p className="col-span-2 line-clamp-2 md:line-clamp-4">
            {course.notes}
          </p>
        </div>
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <form
            action={formAction}
            className="z-20 absolute  flex flex-col bg-white rounded-md shadow-lg p-5 gap-3"
          >
            {message && (
              <p className="text-center w-[15vw] block mx-auto text-red-500">
                {message}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <input
                className="text-center font-bold p-2 rounded border border-gray-300 w-full"
                type="text"
                placeholder="Course Title"
                defaultValue={course.title}
                name="title"
              />
              <select
                className="p-2 rounded border border-gray-300 w-full text-center"
                defaultValue={course.controlForm}
                name="controlForm"
              >
                <option value="exam">Exam</option>
                <option value="offset">Offset</option>
              </select>
              <input
                className="p-2 rounded border border-gray-300 w-full text-center"
                type="text"
                defaultValue={course.teacherLectures}
                placeholder="Teacher of Lectures"
                name="teacherLectures"
              />
              <input
                className="text-center p-2 rounded border border-gray-300 w-full"
                type="text"
                placeholder="Lectures Link"
                defaultValue={course.lecturesLink}
                name="lecturesLink"
              />
              <input
                className="text-center p-2 rounded border border-gray-300 w-full"
                type="text"
                placeholder="Teacher Practices"
                defaultValue={course.teacherPractices}
                name="teacherPractices"
              />
              <input
                className="text-center p-2 rounded border border-gray-300 w-full"
                type="text"
                placeholder="Practices Link"
                defaultValue={course.practicesLink}
                name="practicesLink"
              />
              <textarea
                className="p-2 rounded border border-gray-300 w-full"
                placeholder="Notes about the course"
                defaultValue={course.notes}
                name="notes"
              ></textarea>
              <input
                type="text"
                name="id"
                value={course._id.toString()}
                hidden
                readOnly
              />
              <button
                type="submit"
                className="btn-filled block mx-auto"
                disabled={pending}
              >
                {pending ? "Saving" : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
export default CourseCard
