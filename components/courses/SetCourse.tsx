"use client"
import { editCourse, setCourse } from "server/actions/courses"
import { useActionState } from "react"
import Course, { ControlForm, CourseType } from "types/Course"

interface SetCourseProps {
  major: string
}

interface EditCourseProps {
  course: Omit<
    {
      [Key in keyof Course]: Key extends "_id" ? string : Course[Key]
    },
    "userId"
  >
}

type Props = SetCourseProps | EditCourseProps

const SetCourse: React.FC<Props> = (props) => {
  const isEdit = (props as EditCourseProps).course !== undefined
  const [message, formAction, pending] = useActionState(
    isEdit ? editCourse : setCourse,
    null,
  )
  const course = isEdit ? (props as EditCourseProps).course : null
  const major = !isEdit ? (props as SetCourseProps).major : null
  return (
    <form
      action={formAction}
      aria-label={isEdit ? "Edit course form" : "Add course form"}
    >
      {message && (
        <p className="text-center w-[15vw] block mx-auto text-red-500">
          {message}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="font-semibold">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="p-2 border border-gray-300 rounded-md w-full"
            defaultValue={isEdit ? course?.title : ""}
          />
        </div>
        <div>
          <label htmlFor="controlForm" className="font-semibold">
            Form of control
          </label>
          <select
            name="controlForm"
            id="controlForm"
            className="p-2 border border-gray-300 rounded-md w-full"
            defaultValue={isEdit ? course?.controlForm : ""}
          >
            {Object.values(ControlForm).map((controlForm) => (
              <option key={controlForm} value={controlForm}>
                {controlForm}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type" className="font-semibold">
            Course Type
          </label>
          <select
            name="type"
            id="type"
            className="p-2 border border-gray-300 rounded-md w-full"
            defaultValue={isEdit ? course?.type : ""}
          >
            {Object.values(CourseType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="teacherLectures" className="font-semibold">
            Teacher Lectures
          </label>
          <input
            type="text"
            name="teacherLectures"
            id="teacherLectures"
            className="p-2 border border-gray-300 rounded-md w-full"
            defaultValue={isEdit ? course?.teacherLectures : ""}
          />
        </div>
        <div>
          <label htmlFor="lecturesLink" className="font-semibold">
            Lectures Link
          </label>
          <input
            type="text"
            name="lecturesLink"
            id="lecturesLink"
            className="p-2 border border-gray-300 rounded-md w-full"
            defaultValue={isEdit ? course?.lecturesLink : ""}
          />
        </div>
        <div>
          <label htmlFor="teacherPractices" className="font-semibold">
            Teacher Practices
          </label>
          <input
            type="text"
            name="teacherPractices"
            id="teacherPractices"
            className="p-2 border border-gray-300 rounded-md w-full"
            defaultValue={isEdit ? course?.teacherPractices : ""}
          />
        </div>
        <div>
          <label htmlFor="practicesLink" className="font-semibold">
            Practices Link
          </label>
          <input
            type="text"
            name="practicesLink"
            id="practicesLink"
            className="p-2 border border-gray-300 rounded-md w-full"
            defaultValue={isEdit ? course?.practicesLink : ""}
          />
        </div>
        <div>
          <label htmlFor="notes" className="font-semibold">
            Notes
          </label>
          <input
            type="text"
            name="notes"
            id="notes"
            className="p-2 border border-gray-300 rounded-md w-full"
            defaultValue={isEdit ? course?.notes : ""}
          />
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-4">
        <button
          type="submit"
          className="btn-filled block mx-auto"
          disabled={pending}
        >
          {pending ?
            "Submitting..."
          : isEdit ?
            "Save Changes"
          : "Add Course"}
        </button>
      </div>
      <input
        hidden
        name="id"
        id="id"
        readOnly
        defaultValue={isEdit ? course?._id : ""}
      />
      <input
        hidden
        readOnly
        name="major"
        id="major"
        defaultValue={major?.length ? major : ""}
      />
    </form>
  )
}

export default SetCourse
