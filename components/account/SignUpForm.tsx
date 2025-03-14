"use client"
import Link from "next/link"
import { useActionState } from "react"
import { signUp } from "server/actions/account"

const SignUpForm = () => {
  const [state, formAction, pending] = useActionState(signUp, null)
  return (
    <form action={formAction} className="card flex flex-col gap-4">
      <h1 className="text-center font-bold ">Scripti | Sign Up </h1>
      {state?.error && (
        <p className="text-center max-w-[15em] text-red-500">{state.error}</p>
      )}
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        className="bg-zinc-200 p-2 -mt-2 focus:outline-hidden focus:shadow-xl rounded-md"
        placeholder="John"
        autoComplete="name"
        defaultValue={state?.currentState?.get("name")?.toString()}
      />
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        className="bg-zinc-200 p-2 -mt-2 focus:outline-hidden focus:shadow-xl rounded-md"
        placeholder="john_smith"
        autoComplete="nickname"
        defaultValue={state?.currentState?.get("username")?.toString()}
      />
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        className="bg-zinc-200 p-2 -mt-2 focus:outline-hidden focus:shadow-xl rounded-md"
        placeholder="john_smith@gmail.com"
        autoComplete="email"
        defaultValue={state?.currentState?.get("email")?.toString()}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        className="bg-zinc-200 p-2 -mt-2 focus:outline-hidden focus:shadow-xl rounded-md"
        placeholder=""
        autoComplete="new-password"
        defaultValue={state?.currentState?.get("password")?.toString()}
      />
      <button
        type="submit"
        className="btn-filled block mx-auto"
        disabled={pending}
      >
        {pending ? "Submitting..." : "Sign Up"}
      </button>
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-black font-bold">
          Log in
        </Link>
      </p>
    </form>
  )
}
export default SignUpForm
