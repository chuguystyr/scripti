import CourseCard from "components/CourseCard"
import SearchBar from "components/SearchBar"
import SetCourse from "components/SetCourse"
import { getCourses } from "server/actions/courses"
import { closeAddCourse } from "server/actions/courses"
import AddCourseForm from "components/courses/AddCourseForm"
import NoCoursesBlock from "components/courses/NoCoursesBlock"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Courses | Scripti",
  description: "manage all of your courses in one place",
  robots: "noindex, nofollow",
}

const Courses: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
}> = async ({ searchParams }) => {
  const courses = await getCourses(searchParams?.query?.toString())
  return (
    <main>
      <h1 className="sr-only">Courses page</h1>
      {searchParams?.add && (
        <SetCourse close={closeAddCourse} searchParams={searchParams} />
      )}
      {Array.isArray(courses) && courses.length === 0 && !searchParams?.query ?
        <NoCoursesBlock searchParams={searchParams} />
      : <>
          <SearchBar>
            <AddCourseForm />
          </SearchBar>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.isArray(courses) &&
              courses.length !== 0 &&
              courses.map((course, index) => {
                return (
                  <CourseCard
                    key={index}
                    course={course}
                    searchParams={searchParams}
                  />
                )
              })}
          </div>
        </>
      }
    </main>
  )
}

export default Courses
