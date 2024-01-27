import {
  editCourse,
  deleteTask as del,
  checkTask as check,
} from "server/serverActions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import Task from "types/Task";

export const useTaskCard = (props: Task) => {
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [data, setData] = useState<Task>(props);
  const [state, formAction] = useFormState(editCourse, { message: "" });
  useEffect(() => {
    if (state.message) {
      setEditable(false);
    }
  }, [state]);
  const checkTask = (id: string) => {
    check(id);
    router.refresh();
  };
  const deleteTask = (id: string) => {
    del(id);
    router.refresh();
  };
  return {
    data: { editable, data },
    actions: { setEditable, setData, formAction, checkTask, deleteTask },
  };
};
