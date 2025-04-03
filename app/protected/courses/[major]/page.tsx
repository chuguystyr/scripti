import CourseCard from "components/courses/CourseCard"
import SearchBar from "components/SearchBar"
import { getCourses } from "server/fetchers"
import { Metadata } from "next"
import { BasicPageProps } from "types/Utilities"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Courses | Scripti",
  description: "manage all of your courses in one place",
  robots: "noindex, nofollow",
}

const Courses: React.FC<BasicPageProps> = async ({
  params,
  searchParams: sP,
}) => {
  const searchParams = await sP
  const { major } = await params
  const courses = await getCourses(+major, searchParams?.query?.toString())
  return (
    <main>
      <h1 className="sr-only">Courses page</h1>
      <SearchBar>
        <Link
          href={`/protected/courses/${major}/new`}
          className="btn-outlined"
          scroll={false}
        >
          New Course
        </Link>
      </SearchBar>
      {courses.length === 0 && (
        <p className="card w-fit text-center mx-auto">
          Looks like you&apos;re first time here.
          <br />
          Let&apos;s add some courses to compose schedule from and add tasks for
        </p>
      )}
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {courses.length !== 0 &&
          courses.map((course, index) => {
            return <CourseCard key={index} {...course} />
          })}
      </div>
    </main>
  )
}

export default Courses
