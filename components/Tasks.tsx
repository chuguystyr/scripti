import { getTasks, openAddTaskAtHome } from "server/actions/tasks";
import TaskCard from "components/TaskCard";
import SetTask from "components/SetTask";
import { closeAddTaskAtHome } from "server/actions/tasks";

const Tasks = async () => {
  const { tasks, done } = await getTasks();
  const statistics = {
    inProgress:
      tasks.filter((task) => task.status === "in progress").length ?? 0,
    waiting: tasks.filter((task) => task.status === "new").length ?? 0,
  };
  return (
    <section id="right" className="md:w-1/2">
      <section id="statistics" className="flex md:flex-row gap-5 md:gap-10">
        <p className="card text-center w-1/3 md:h-[15vh] md:w-[15vw]">
          New <br />
          {statistics.waiting}
        </p>
        <p className="card text-center w-1/3 md:h-[15vh] md:w-[15vw]">
          In progress <br />
          {statistics.inProgress}
        </p>
        <p className="card text-center w-1/3 md:h-[15vh] md:w-[15vw]">
          Done <br />
          {done}
        </p>
        <SetTask close={closeAddTaskAtHome} />
      </section>
      <section className="mt-10 h-[55vh] flex flex-wrap gap-3" id="tasks">
        {tasks && tasks.length === 0 && (
          <p className="card h-fit block mx-auto text-center">
            Doddy is free!
            <br />
            If you need to add a task please click{" "}
            <form action={openAddTaskAtHome}>
              <button className="font-semibold hover:underline underline-offset-4">
                here
              </button>
            </form>
          </p>
        )}
        {tasks &&
          tasks.length !== 0 &&
          tasks.map((task, index) => <TaskCard key={index} {...task} />)}
      </section>
    </section>
  );
};

export default Tasks;
