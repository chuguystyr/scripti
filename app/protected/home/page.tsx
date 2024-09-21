import Schedule from "components/schedule/Schedule"
import Tasks from "components/Tasks"
import Quote from "components/Quote"
import Name from "components/Name"
import DateTime from "components/DateTime"
import {
  setTaskEditableAtHome as setEditable,
  setTaskNonEditableAtHome as resetEditable,
} from "server/actions/tasks"
const Home: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
}> = async ({ searchParams }) => {
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
        <section className="card mt-10 md:w-[44.7vw]" id="schedule">
          <Schedule />
        </section>
      </section>
      <Tasks
        searchParams={searchParams}
        setEditable={setEditable}
        resetEditable={resetEditable}
      />
    </main>
  )
}
export default Home
