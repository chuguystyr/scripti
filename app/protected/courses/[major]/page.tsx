import CourseCard from "components/CourseCard"
import SearchBar from "components/SearchBar"
import SetCourse from "components/SetCourse"
import { getCourses } from "server/actions/courses"
import { Metadata } from "next"
import { BasicPageProps } from "types/Utilities"

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
        <SetCourse major={major} />
      </SearchBar>
      {courses.length === 0 && (
        <p className="text-center">
          Looks like you&apos;re first time here.
          <br />
          Let&apos;s add some courses to use in schedule
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
