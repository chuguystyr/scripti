import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import { authContext } from "utils/authContext";
import { login } from "lib/serverActions";

export const useLogin = () => {
  const [state, formAction] = useFormState(login, { message: "" });
  const router = useRouter();
  const message = useSearchParams().get("message");
  const { setAuthenticated } = useContext(authContext);

  useEffect(() => {
    if (state.message === "User logged in") {
      setAuthenticated(true);
      router.push("/protected/home");
    }
  }, [router, setAuthenticated, state.message]);

  return { state, formAction, message };
};
