import Link from "next/link"
import { RiDeleteBin7Fill } from "react-icons/ri"
import Course from "types/Course"
import { deleteCourse } from "server/actions/courses"
import EditLink from "components/EditLink"
import { RxDividerVertical } from "react-icons/rx"
const CourseCard: React.FC<
  Omit<
    {
      [Key in keyof Course]: Key extends "_id" ? string : Course[Key]
    },
    "userId"
  >
> = (course) => {
  return (
    <div className="card w-full p-4">
      <div className="flex justify-between">
        <h2 className="text-center text-lg font-bold w-4/5">{course.title}</h2>
        <EditLink _id={course._id} itemType="course" />
        <form
          action={deleteCourse}
          className="cursor-pointer flex items-center"
        >
          <input type="text" name="id" value={course._id} hidden readOnly />
          <button
            type="submit"
            className="hover:cursor-pointer"
            aria-label="Delete course"
          >
            <RiDeleteBin7Fill />
          </button>
        </form>
      </div>
      <div className="flex justify-center mb-2">
        <span className="font-mono font-semibold">{course.type}</span>
        <RxDividerVertical className="self-center" />
        <span className="font-mono font-semibold">{course.controlForm}</span>
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
          <div className="relative group col-span-2">
            <p className="line-clamp-1">{course.notes}</p>
            <span className="invisible group-hover:visible absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 p-2 text-sm whitespace-normal shadow-lg">
              {course.notes}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseCard
