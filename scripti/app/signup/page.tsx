"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect, useContext } from "react";
import { signUp } from "@/utils/serverActions";
import SubmitButton from "@/components/SubmitButton";
import { authContext } from "@/utils/authContext";

const SignUp = () => {
  const [state, formAction] = useFormState(signUp, { message: "" });
  const router = useRouter();
  const { setAuthenticated } = useContext(authContext);
  useEffect(() => {
    if (state.message === "User created") {
      setAuthenticated(true);
      router.push("/login", {
        query: {
          message: "after signup",
        },
      });
    }
  }, [state]);
  return (
    <div className="w-[100vw] h-[100vh] bg-zinc-300 flex items-center justify-center">
      <form
        action={formAction}
        className="flex flex-col bg-white p-4 shadow-xl rounded-md gap-4"
      >
        <h1 className="text-center font-bold ">Scripti | Sign Up </h1>
        {state.message && (
          <p className="text-center text-red-500">{state.message}</p>
        )}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder="John"
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder="john_smith"
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder="john_smith@gmail.com"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder=""
        />
        <SubmitButton text="Sign Up" />
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-bold">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};
export default SignUp;
