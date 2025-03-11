import Schedule from "components/schedule/Schedule"
import Tasks from "components/tasks/Tasks"
import Quote from "components/Quote"
import { Metadata } from "next"
import { Params } from "types/Utilities"
import GreetingBlock from "components/GreetingBlock"
import TaskStatistics from "components/TasksStatistics"

export const metadata: Metadata = {
  title: "Home | Scripti",
  description: "Access your personalized Scripti dashboard",
  robots: "noindex, nofollow",
}

const Home: React.FC<Params> = async ({ params }) => {
  return (
    <main className="flex flex-col gap-5 md:grid md:grid-cols-4" id="home">
      <h1 className="sr-only">Scripti app&apos;s home page</h1>
      <GreetingBlock />
      <Quote />
      <Schedule params={params} />
      <TaskStatistics params={params} />
      <Tasks params={params} />
    </main>
  )
}
export default Home
