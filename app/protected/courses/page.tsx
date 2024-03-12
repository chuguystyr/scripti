import CourseCard from "components/CourseCard";
import SetCourse from "components/SetCourse";
import { getCourses } from "server/actions/courses";
import { openAddCourse, closeAddCourse } from "server/actions/courses";

const Courses: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined };
}> = async ({ searchParams }) => {
  const courses = await getCourses();
  return (
    <>
      {Array.isArray(courses) && courses.length === 0 ?
        <>
          {!searchParams?.add && (
            <p className="text-center">
              Looks like you&apos;re first time here.
              <br />
              Let&apos;s add some courses to use in schedule
            </p>
          )}
          {!searchParams?.add && (
            <form action={openAddCourse}>
              <button
                type="submit"
                className="btn-filled block mx-auto w-10 mt-5"
              >
                Add Courses
              </button>
            </form>
          )}
          {searchParams?.add && <SetCourse close={closeAddCourse} />}
        </>
      : <>
          <div className="flex flex-col md:flex-row items-center my-4">
            <input
              type="text"
              name="search"
              id="search"
              className="py-2 px-4 rounded-md border border-gray-300 w-full mr-5 md:w-auto"
              placeholder="Search"
            />
            <div className="w-[20vw] flex gap-3 mt-3 md:mt-0">
              <button type="button" className="btn-filled">
                Search
              </button>
              <form action={openAddCourse}>
                <button
                  type="submit"
                  className="btn-filled w-full hover:w-[120%]"
                >
                  Add Course
                </button>
              </form>
              {searchParams?.add && <SetCourse close={closeAddCourse} />}
            </div>
          </div>
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
                );
              })}
          </div>
        </>
      }
    </>
  );
};

export default Courses;
