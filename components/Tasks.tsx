import { getTasks, openAddTaskAtHome } from "server/actions/tasks"
import TaskCard from "components/TaskCard"
import SetTask from "components/SetTask"
import { closeAddTaskAtHome } from "server/actions/tasks"
import { BasicPageProps } from "types/Utilities"

const Tasks: React.FC<
  {
    setEditable: () => Promise<never>
    resetEditable: () => Promise<never>
  } & BasicPageProps
> = async ({ searchParams: sP, params, setEditable, resetEditable }) => {
  const { major } = await params
  const searchParams = await sP
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
      {searchParams && searchParams?.add && (
        <SetTask close={closeAddTaskAtHome} searchParams={sP} params={params} />
      )}
      <section
        className="mt-10 flex flex-col md:grid md:grid-cols-2 gap-3"
        id="tasks"
      >
        {tasks && tasks.length === 0 && (
          <div className="card h-fit block mx-auto text-center">
            <p className="inline">
              Doddy is free!
              <br />
              If you need to add a task please click{" "}
            </p>
            <form action={openAddTaskAtHome} className="inline">
              <button className="font-semibold hover:underline underline-offset-4">
                here
              </button>
            </form>
          </div>
        )}
        {tasks &&
          tasks.length !== 0 &&
          tasks.map((task, index) => (
            <TaskCard
              key={index}
              task={task}
              searchParams={sP}
              setEditable={setEditable}
              resetEditable={resetEditable}
            />
          ))}
        {tasks && tasks.length !== 0 && (
          <form
            action={openAddTaskAtHome}
            className="self-center justify-self-center md:col-start-1 md:col-end-3"
          >
            <button className="font-bold btn-outlined text-3xl text-center">
              +
            </button>
          </form>
        )}
      </section>
    </section>
  )
}

export default Tasks
