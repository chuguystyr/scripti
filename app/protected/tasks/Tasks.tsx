"use client";
import TaskCard from "components/TaskCard";
import SetTask from "components/SetTask";
import { useState } from "react";

interface Props {
  title: string;
  date: string;
  course: string;
  status: string;
  description: string;
  id: string;
}

const Tasks = ({ tasks }: { tasks: Props[] }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      {tasks.length === 0 ?
        <>
          {!show && (
            <p className="text-center">
              Looks like you&apos;re first time here. Let&apos;s add some tasks
            </p>
          )}
          {!show && (
            <button
              type="button"
              className="block btn-filled mx-auto mt-5"
              onClick={() => setShow((prev) => !prev)}
            >
              Add Task
            </button>
          )}
          {show && <SetTask close={setShow} />}
        </>
      : <>
          <div className="flex flex-col md:flex-row items-center my-4">
            <input
              type="text"
              className="py-2 px-4 rounded-md border border-gray-300 w-full mr-5 md:w-auto"
              placeholder="Search"
            />
            <div className="w-[20vw] flex gap-3 mt-3 md:mt-0">
              <button type="button" className="btn-filled">
                Search
              </button>
              <button
                type="button"
                className="btn-filled"
                onClick={() => setShow((prev) => !prev)}
              >
                Add Task
              </button>
              {show && <SetTask close={setShow} />}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task) => {
              return <TaskCard key={task.id} {...task} />;
            })}
          </div>
        </>
      }
    </>
  );
};

export default Tasks;
