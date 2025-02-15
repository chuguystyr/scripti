import TaskCard from "components/tasks/TaskCard"
import SetTask from "components/tasks/SetTask"
import { getAllTasks } from "server/fetchers"
import SearchBar from "components/SearchBar"
import { Metadata } from "next"
import { BasicPageProps } from "types/Utilities"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tasks | Scripti",
  description: "manage all of your tasks in one place",
  robots: "noindex, nofollow",
}

const Tasks: React.FC<BasicPageProps> = async ({ params, searchParams }) => {
  const sParams = await searchParams
  const { major } = await params
  const tasks = await getAllTasks(+major, sParams?.query?.toString())
  return (
    <main>
      <h1 className="sr-only">Tasks page</h1>
      {tasks.length === 0 ?
        <div className="flex flex-col w-fit">
          <p className="text-center">
            Looks like you&apos;re first time here. Let&apos;s add some tasks
          </p>
          <SetTask task={undefined} />
        </div>
      : <>
          <SearchBar>
            <Link
              href={`/protected/tasks/${major}/new`}
              className="btn-outlined"
            >
              New Task
            </Link>
          </SearchBar>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.isArray(tasks) &&
              tasks.map((task) => {
                return (
                  <TaskCard
                    key={task._id.toString()}
                    {...{ ...task, _id: task._id.toString() }}
                  />
                )
              })}
          </div>
        </>
      }
    </main>
  )
}

export default Tasks
