import { getStatistics } from "server/fetchers"
import { Params } from "types/Utilities"

const TaskStatistics: React.FC<Params> = async ({ params }) => {
  const { major } = await params
  const { done, newTasks, inProgress } = await getStatistics(+major)
  return (
    <section
      id="statistics"
      className="flex justify-between gap-5 md:col-start-3 md:col-end-5 md:row-start-1 md:row-end-2"
    >
      <p className="card text-center w-1/3">
        New <br />
        {newTasks}
      </p>
      <p className="card text-center w-1/3">
        In progress <br />
        {inProgress}
      </p>
      <p className="card text-center w-1/3">
        Done <br />
        {done}
      </p>
    </section>
  )
}
export default TaskStatistics
