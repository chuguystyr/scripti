import { openAddCourse } from "server/actions/courses"

const AddCourseForm = () => {
  return (
    <form action={openAddCourse} className="flex justify-center">
      <button type="submit" className="btn-outlined">
        Add Course
      </button>
    </form>
  )
}

export default AddCourseForm
