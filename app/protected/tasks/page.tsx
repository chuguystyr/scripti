import TaskCard from "components/TaskCard"
import SetTask from "components/SetTask"
import {
  closeAddTask,
  getAllTasks,
  openAddTask,
  setTaskEditableAtTasks as setEditable,
  setTaskNonEditableAtTasks as resetEditable,
} from "server/actions/tasks"
import SearchBar from "components/SearchBar"
import { Metadata } from "next"
import { SearchParams } from "types/Utilities"

export const metadata: Metadata = {
  title: "Tasks | Scripti",
  description: "manage all of your tasks in one place",
  robots: "noindex, nofollow",
}

const Tasks: React.FC<SearchParams> = async (props) => {
  const searchParams = await props
  const tasks = await getAllTasks(searchParams?.query?.toString())
  return (
    <main>
      <h1 className="sr-only">Tasks page</h1>
      {(
        !tasks ||
        (Array.isArray(tasks) && tasks.length === 0 && !searchParams?.query)
      ) ?
        <>
          {!searchParams?.add && (
            <>
              <p className="text-center">
                Looks like you&apos;re first time here. Let&apos;s add some
                tasks
              </p>
              <form action={openAddTask} className="flex justify-center">
                <button type="submit" className="btn-outlined">
                  Add Task
                </button>
              </form>
            </>
          )}
          {searchParams?.add && (
            <SetTask close={closeAddTask} searchParams={searchParams} />
          )}
        </>
      : <>
          <SearchBar>
            <form action={openAddTask}>
              <button type="submit" className="btn-outlined">
                Add Task
              </button>
            </form>
            {searchParams?.add && (
              <SetTask close={closeAddTask} searchParams={searchParams} />
            )}
          </SearchBar>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.isArray(tasks) &&
              tasks.map((task) => {
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    searchParams={searchParams}
                    setEditable={setEditable}
                    resetEditable={resetEditable}
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
