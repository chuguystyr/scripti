import { getTasks } from "server/fetchers"
import TaskCard from "components/tasks/TaskCard"
import { Params } from "types/Utilities"
import Link from "next/link"

const Tasks: React.FC<Params> = async ({ params }) => {
  const { major } = await params
  const { tasks } = (await getTasks(+major)) ?? { tasks: [], done: 0 }
  return (
    <section className="flex flex-col md:col-start-3 md:col-end-5 md:row-start-2 md:grid md:grid-cols-2 gap-5">
      {tasks && tasks.length === 0 && (
        <div className="card h-fit block mx-auto text-center col-start-1 col-end-3">
          <p className="mb-2">
            Doddy is free! If you need to add a new task click{" "}
            <Link
              href={`/protected/home/${major}/tasks/new`}
              className="font-semibold hover:underline underline-offset-4"
              scroll={false}
            >
              here
            </Link>
          </p>
        </div>
      )}
      {tasks &&
        tasks.length !== 0 &&
        tasks.map((task, index) => (
          <TaskCard key={index} {...{ ...task, _id: task._id.toString() }} />
        ))}
      {tasks && tasks.length !== 0 && (
        <Link
          href={`/protected/home/${major}/tasks/new`}
          className="btn-outlined w-fit h-fit md:col-start-1 md:col-end-3 mx-auto"
          scroll={false}
        >
          New Task
        </Link>
      )}
    </section>
  )
}

export default Tasks
