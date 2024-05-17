import TaskCard from "components/TaskCard"
import SetTask from "components/SetTask"
import {
  closeAddTask,
  getAllTasks,
  openAddTask,
  setTaskEditableAtTasks as setEditable,
  setTaskNonEditableAtTasks as resetEditable,
} from "server/actions/tasks"

const Tasks: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
}> = async ({ searchParams }) => {
  const tasks = await getAllTasks()
  return (
    <>
      {!tasks || (Array.isArray(tasks) && tasks.length === 0) ?
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
          <div className="flex flex-col md:flex-row items-center my-4">
            <input
              type="text"
              name="search"
              id="search"
              className="py-2 px-4 rounded-md border border-gray-300 w-full mr-5 md:w-auto"
              placeholder="Search"
            />
            <div className="w-[20vw] flex gap-3 mt-3 md:mt-0">
              <button type="button" className="btn-outlined">
                Search
              </button>
              <form action={openAddTask}>
                <button type="submit" className="btn-outlined">
                  Add Task
                </button>
              </form>
              {searchParams?.add && (
                <SetTask close={closeAddTask} searchParams={searchParams} />
              )}
            </div>
          </div>
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
    </>
  )
}

export default Tasks
