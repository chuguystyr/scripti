// import Schedule from "components/schedule/Schedule"
import Tasks from "components/Tasks"
import Quote from "components/Quote"
import Name from "components/Name"
import DateTime from "components/DateTime"
import {
  setTaskEditableAtHome as setEditable,
  setTaskNonEditableAtHome as resetEditable,
} from "server/actions/tasks"
import { Metadata } from "next"
import { BasicPageProps } from "types/Utilities"

export const metadata: Metadata = {
  title: "Home | Scripti",
  description: "Access your personalized Scripti dashboard",
  robots: "noindex, nofollow",
}

const Home: React.FC<BasicPageProps> = async ({params, searchParams}) => {
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
          {/* TODO: investigate problem with displaying schedule */}
          {/* <Schedule /> */}
        </section>
      </section>
      <Tasks
        setEditable={setEditable}
        resetEditable={resetEditable}
        searchParams={searchParams}
        params={params}
      />
    </main>
  )
}
export default Home
