import { useState, useEffect } from "react";
import { getTasks, getSchedule, getAccount } from "lib/serverActions";
import Task from "types/Task";
import Schedule from "types/Schedule";
import User from "types/User";

export const useHomeData = () => {
  const [tasks, setTasks] = useState<{ tasks: Task[]; done: number }>({
    tasks: [],
    done: 0,
  });
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [name, setName] = useState<string>("");
  const [quote, setQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    const getHomeData = async () => {
      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();
      setQuote({ text: data.content, author: data.author });
      const { tasks, done } = await getTasks();
      setTasks((prev) => ({ ...prev, tasks, done }));
      const { schedule } = await getSchedule();
      setSchedule(schedule);
      const account  = await getAccount();
      if (!("message" in account)) {
        const { name } = account;
        setName(name);
      };
    };
    getHomeData();
  }, []);
  return { tasks, schedule, name, quote };
};
