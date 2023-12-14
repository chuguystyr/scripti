import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { signUp } from "utils/serverActions";

export const useSignUp = () => {
  const [state, formAction] = useFormState(signUp, { message: "" });
  const router = useRouter();

  useEffect(() => {
    if (state.message === "User created") {
      router.push("/login?message='after signup");
    }
  }, [router, state]);

  return { state, formAction };
};
