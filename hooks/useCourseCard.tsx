import { editTask } from "server/serverActions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import Course from "types/Course";
import { deleteCourse as del } from "server/serverActions";

export const useCourseCard = (props: Course) => {
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [data, setData] = useState<Course>(props);
  const [state, formAction] = useFormState(editTask, { message: "" });
  useEffect(() => {
    if (state.message) {
      setEditable(false);
    }
  }, [state]);
  const deleteCourse = (id: string) => {
    del(id);
    router.refresh();
  };
  return {
    data: { editable, data },
    actions: { setEditable, setData, formAction, deleteCourse },
  };
};
