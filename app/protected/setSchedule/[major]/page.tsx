import SetSchedule from "components/schedule/SetSchedule"
import { getCourses } from "server/fetchers"
import { BasicPageProps } from "types/Utilities"

const SetSchedulePage: React.FC<BasicPageProps> = async ({ params }) => {
  const { major } = await params
  const courses = await getCourses(+major)
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="sr-only">Set schedule page</h1>
      <SetSchedule courses={courses} major={major} />
    </main>
  )
}

export default SetSchedulePage
