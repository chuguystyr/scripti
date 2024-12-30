import Schedule from "components/schedule/Schedule"
import Tasks from "components/tasks/Tasks"
import Quote from "components/Quote"
import Name from "components/Name"
import DateTime from "components/DateTime"
import { Metadata } from "next"
import { Params } from "types/Utilities"

export const metadata: Metadata = {
  title: "Home | Scripti",
  description: "Access your personalized Scripti dashboard",
  robots: "noindex, nofollow",
}

const Home: React.FC<Params> = async ({ params }) => {
  return (
    <main className="flex flex-col md:flex-row gap-5 md:gap-10">
      <h1 className="sr-only">Scripti app&apos;s home page</h1>
      <section id="left" className="md:w-1/2">
        <section
          className="flex flex-col md:flex-row justify-between"
          id="greeting"
        >
          <div className="card h-[15vh] w-full mb-4 md:w-fit md:mb-0 md:mr-4">
            <Name />
            <DateTime />
          </div>
          <Quote />
        </section>
        <section className="card mt-10 flex justify-center" id="schedule">
          <Schedule params={params} />
        </section>
      </section>
      <Tasks params={params} />
    </main>
  )
}
export default Home
