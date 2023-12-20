"use client";
import Link from "next/link";
import SubmitButton from "components/SubmitButton";
import { useLogin } from "hooks/useLogin";
const Login: React.FC<{}> = () => {
  const { state, formAction, message } = useLogin();
  return (
    <div className="w-[100vw] h-[100vh] bg-zinc-300 flex items-center justify-center">
      <form
        action={formAction}
        className="flex flex-col bg-white p-4 shadow-xl rounded-md gap-4"
      >
        <h1 className="text-center font-bold ">Scripti | Log in </h1>
        {state.message && state.message !== "User logged in" && (
          <p className="text-center w-[15vw] block mx-auto text-red-500">
            {state.message}
          </p>
        )}
        {message ?
          <p className="text-center w-[15vw] block mx-auto text-green-500">
            Thanks for signing up.
            <br />
            Enjoy the app.
          </p>
        : null}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder="john_smith"
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
        <SubmitButton text="Log in" />
        <p className="text-center text-sm">
          Don&apos;t have an account? &nbsp;
          <Link href="/signup" className="text-black font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Login;
