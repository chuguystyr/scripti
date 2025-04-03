import SetSchedule from "components/schedule/SetSchedule"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCourses } from "server/fetchers"
import { BasicPageProps } from "types/Utilities"

export const metadata: Metadata = {
  title: "Set schedule | Scripti",
  description: "Manage your schedule",
  robots: "noindex, nofollow",
}

const SetSchedulePage: React.FC<BasicPageProps> = async ({ params }) => {
  const { major } = await params
  const courses = await getCourses(+major)
  if (courses.length === 0) redirect(`/protected/courses/${major}`)
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="sr-only">Set schedule page</h1>
      <SetSchedule courses={courses} major={major} />
    </main>
  )
}

export default SetSchedulePage
