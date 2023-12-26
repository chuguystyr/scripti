import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { setCourse, setTask } from "server/serverActions";

export const useSet = (
  close: Dispatch<SetStateAction<boolean>>,
  type: string,
) => {
  const action = type === "course" ? setCourse : setTask;
  const [state, formAction] = useFormState(action, { message: "" });
  const router = useRouter();
  useEffect(() => {
    if (state.message) {
      close((prev) => !prev);
    }
  }, [state, router, close]);
  return formAction;
};
