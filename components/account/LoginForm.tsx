"use client"
import Link from "next/link"
import { useActionState } from "react"
import { login } from "server/actions/account"
import { SuccessMessages } from "types/Utilities"

const LoginForm: React.FC<{ signedUp: boolean }> = ({ signedUp }) => {
  const [message, formAction, pending] = useActionState(login, null)
  return (
    <form action={formAction} className="card flex flex-col gap-4">
      <h1 className="text-center font-bold ">Scripti | Log in </h1>
      {message && (
        <p className="text-center block mx-auto text-red-500">{message}</p>
      )}
      {signedUp && (
        <p className="text-center w-[15vw] block mx-auto text-green-500">
          {SuccessMessages.SIGNED_UP}
        </p>
      )}
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        className="bg-zinc-200 p-2 -mt-2 focus:outline-hidden focus:shadow-xl rounded-md"
        placeholder="john_smith"
        autoComplete="nickname"
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        className="bg-zinc-200 p-2 -mt-2 focus:outline-hidden focus:shadow-xl rounded-md"
        placeholder=""
        autoComplete="current-password"
      />
      <button
        type="submit"
        className="btn-filled block mx-auto"
        disabled={pending}
      >
        {pending ? "Submitting..." : "Log in"}
      </button>
      <p className="text-center text-sm">
        Don&apos;t have an account? &nbsp;
        <Link href="/signup" className="text-black font-bold">
          Sign up
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
