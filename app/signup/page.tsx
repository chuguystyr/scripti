import Link from "next/link"
import SubmitButton from "components/SubmitButton"
import { signUp } from "server/actions/account"

const SignUp: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
}> = ({ searchParams }) => {
  let message = ""
  switch (searchParams?.error) {
    case "fields":
      message = `Please fill in\nall fields`
      break
    case "username":
      message = `This username is already taken`
      break
    case "password":
      message = `Password must have 8-20 characters, including an uppercase letter, a lowercase letter, a digit, and a special character.`
      break
    case "internal":
      message = `Something went wrong.\nPlease try again`
      break
  }
  return (
    <main className="w-[100vw] h-[100vh] bg-zinc-300 flex items-center justify-center">
      <form
        action={signUp}
        className="flex flex-col bg-white p-4 shadow-xl rounded-md gap-4"
      >
        <h1 className="text-center font-bold ">Scripti | Sign Up </h1>
        {searchParams?.error && (
          <p className="text-center max-w-[15em] text-red-500">{message}</p>
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
    </main>
  )
}
export default SignUp
