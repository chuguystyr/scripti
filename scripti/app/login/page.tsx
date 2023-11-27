'use client'
import Link from 'next/link';
import { login } from '@/utils/serverActions';
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect, useContext } from "react";
import SubmitButton from "@/components/SubmitButton";
import { useSearchParams } from 'next/navigation';
import { authContext } from '@/utils/authContext';

const Login = () => {
  const [state, formAction] = useFormState(login, { message: "" });
  const router = useRouter();
  const message = useSearchParams().get('message');
  const { setAuthenticated } = useContext(authContext);
  useEffect(() => {
    if (state.message === "User logged in") {
      setAuthenticated(true);
      router.push("/protected/home");
    }
  }, [state]);
  return (
    <div className="w-[100vw] h-[100vh] bg-zinc-300 flex items-center justify-center">
      <form
        action={formAction}
        className="flex flex-col bg-white p-4 shadow-xl rounded-md gap-4"
      >
        <h1 className="text-center font-bold ">Scripti | Log in </h1>
        {state.message && state.message !== 'User logged in' && (
          <p className="text-center w-[15vw] block mx-auto text-red-500">{state.message}</p>
        )}
        {message ? (
          <p className="text-center w-[15vw] block mx-auto text-green-500">Thanks for signing up.
          <br/>
          Enjoy the app.
          </p>
        ) : null
        }
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder="john_smith"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="bg-zinc-200 p-2 -mt-2 focus:outline-none focus:shadow-xl rounded-md"
          placeholder=""
        />
        <SubmitButton text='Log in'/>
        <p className="text-center text-sm">
          Don't have an account? &nbsp;
          <Link href="/signup" className="text-black font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Login;