import Link from "next/link"
import { RiDeleteBin7Fill } from "react-icons/ri"
import Course from "types/Course"
import { deleteCourse } from "server/actions/courses"
import EditLink from "components/EditLink"
const CourseCard: React.FC<Omit<Course, "userId">> = (course) => {
  return (
    <div className="card w-full p-4">
      <div className="flex justify-between">
        <h2 className="text-center text-lg font-bold w-4/5">{course.title}</h2>
        <EditLink _id={course._id.toString()} itemType="course" />
        <form
          action={deleteCourse}
          className="cursor-pointer flex items-center"
        >
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
        <span className="font-semibold italic">Lectures:</span>
        <span>{course.teacherLectures}</span>
        <Link
          href={course?.lecturesLink || "#"}
          className="text-blue-600 hover:text-blue-800"
        >
          Link
        </Link>
      </div>
      <div className="grid grid-cols-[1fr_2fr_0.5fr] gap-2 mb-2">
        <span className="font-semibold italic">Practices:</span>
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
          <span className="font-semibold italic">Notes:</span>
          <p className="col-span-2 line-clamp-1">{course.notes}</p>
        </div>
      )}
    </div>
  )
}

export default CourseCard
