import { useEffect, useState } from "react";
import Task from "../types/Task";
import { getAllTasks } from "server/serverActions";

export const useTasks = () => {
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  useEffect(() => {
    const getData = async () => {
      const tasks = await getAllTasks();
      setTasks(tasks);
    };
    getData();
  }, [show]);
  return { tasks, show, setShow };
};
