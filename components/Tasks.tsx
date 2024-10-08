import { getTasks, openAddTaskAtHome } from "server/actions/tasks"
import TaskCard from "components/TaskCard"
import SetTask from "components/SetTask"
import { closeAddTaskAtHome } from "server/actions/tasks"

const Tasks: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
  setEditable: () => Promise<never>
  resetEditable: () => Promise<never>
}> = async ({ searchParams, setEditable, resetEditable }) => {
  const { tasks, done } = (await getTasks()) ?? { tasks: [], done: 0 }
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
        <SetTask close={closeAddTaskAtHome} searchParams={searchParams} />
      )}
      <section className="mt-10 grid grid-cols-2 gap-3" id="tasks">
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
              searchParams={searchParams}
              setEditable={setEditable}
              resetEditable={resetEditable}
            />
          ))}
        {tasks && tasks.length !== 0 && (
          <form action={openAddTaskAtHome}>
            <button className="font-bold btn-outlined mt-7 text-3xl text-center">
              +
            </button>
          </form>
        )}
      </section>
    </section>
  )
}

export default Tasks
