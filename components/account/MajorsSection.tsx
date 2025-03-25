import Course from "models/Course"
import Task from "models/Task"
import User from "models/User"
import Link from "next/link"
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa"
import { protector } from "server/protection"
import dbConnect from "server/db"
import { deleteMajor } from "server/actions/account"

const MajorsSection = async () => {
  const id = await protector()
  await dbConnect()
  const { majors } = await User.findById(id).orFail()
  const majorStats = await Promise.all(
    majors.map(async (major) => {
      const [courseCount, taskCount] = await Promise.all([
        Course.countDocuments({ major }),
        Task.countDocuments({ major }),
      ])
      return { major, courseCount, taskCount }
    }),
  )
  return (
    <section>
      <h2 className="text-xl font-bold my-4 text-center">Majors</h2>
      <article className="flex justify-center space-x-4">
        {majorStats.map(({ major, courseCount, taskCount }) => (
          <div key={major} className="card">
            <div className="flex justify-between space-x-2 items-center">
              <span className="italic font-semibold">{major}</span>
              <Link
                href={`/protected/account/majors/edit/${major}`}
                aria-label="courses"
                scroll={false}
              >
                <FaEdit />
              </Link>
              {majors.length > 1 && (
                <form action={deleteMajor}>
                  <input type="hidden" name="major" value={major} readOnly />
                  <button
                    type="submit"
                    aria-label="delete major"
                    className="hover:cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </form>
              )}
            </div>
            <div>
              <p>Courses: {courseCount}</p>
              <p>Tasks: {taskCount}</p>
            </div>
          </div>
        ))}
        <Link
          href="/protected/account/majors/add"
          aria-label="add major"
          scroll={false}
          className="btn-outlined h-fit self-center"
        >
          <FaPlus />
        </Link>
      </article>
    </section>
  )
}
export default MajorsSection
