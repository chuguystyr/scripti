import { getTasks } from "server/fetchers"
import TaskCard from "components/TaskCard"
import { Params } from "types/Utilities"
import SetTask from "components/SetTask"

const Tasks: React.FC<Params> = async ({ params }) => {
  const { major } = await params
  const { tasks, done } = (await getTasks(+major)) ?? { tasks: [], done: 0 }
  const statistics = {
    inProgress:
      tasks.filter((task) => task.status === "in progress").length ?? 0,
    waiting: tasks.filter((task) => task.status === "new").length ?? 0,
  }
  return (
    <section id="right" className="md:w-1/2">
      <section id="statistics" className="flex md:flex-row gap-5 md:gap-10">
        <p className="card text-center w-1/3 md:h-[15vh]">
          New <br />
          {statistics.waiting}
        </p>
        <p className="card text-center w-1/3 md:h-[15vh]">
          In progress <br />
          {statistics.inProgress}
        </p>
        <p className="card text-center w-1/3 md:h-[15vh]">
          Done <br />
          {done}
        </p>
      </section>
      <section
        className="mt-10 flex flex-col md:grid md:grid-cols-2 gap-3"
        id="tasks"
      >
        {tasks && tasks.length === 0 && (
          <div className="card h-fit block mx-auto text-center">
            <p className="inline">Doddy is free!</p>
            <SetTask task={undefined} />
          </div>
        )}
        {tasks &&
          tasks.length !== 0 &&
          tasks.map((task, index) => (
            <TaskCard key={index} {...{ ...task, _id: task._id.toString() }} />
          ))}
        {tasks && tasks.length !== 0 && <SetTask task={undefined} />}
      </section>
    </section>
  )
}

export default Tasks
