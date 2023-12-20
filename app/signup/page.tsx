"use client";

import Link from "next/link";
import SubmitButton from "components/SubmitButton";
import { useSignUp } from "hooks/useSIgnUp";

const SignUp = () => {
  const { state, formAction } = useSignUp();
  return (
    <div className="w-[100vw] h-[100vh] bg-zinc-300 flex items-center justify-center">
      <form
        action={formAction}
        className="flex flex-col bg-white p-4 shadow-xl rounded-md gap-4"
      >
        <h1 className="text-center font-bold ">Scripti | Sign Up </h1>
        {state.message && state.message !== "User created" && (
          <p className="text-center text-red-500">{state.message}</p>
        )}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder="John"
          autoComplete="on"
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder="john_smith"
          autoComplete="on"
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder="john_smith@gmail.com"
          autoComplete="on"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder=""
          autoComplete="on"
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
