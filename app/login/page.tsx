import Link from "next/link"
import SubmitButton from "components/SubmitButton"
import { login } from "server/actions/account"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log In | Scripti",
  description:
    "Access your Scripti account to manage your study plans, schedules, and tasks. Log in now to boost your academic productivity!",
  keywords: [
    "login",
    "sign in",
    "Scripti",
    "student planner",
    "study organization",
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Log In to Scripti",
    description:
      "Access your personalized study planner and task manager. Log in to Scripti and stay on top of your academic goals!",
    type: "website",
    siteName: "Scripti",
  },
  twitter: {
    card: "summary",
    title: "Scripti Login",
    description:
      "Log in to Scripti and take control of your studies. Access your personalized planner now!",
  },
}

const Login: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined }
}> = ({ searchParams }) => {
  let message = ""
  switch (searchParams?.error) {
    case "fields":
      message = `Please fill in\nall fields`
      break
    case "credentials":
      message = "Invalid credentials"
      break
    case "internal":
      message = `Something went wrong.\nPlease try again`
      break
  }
  if (searchParams?.status === "signed up") {
    message = `Thanks for signing up.\nEnjoy the app.`
  }
  return (
    <main className="w-[100vw] h-[100vh] bg-zinc-300 flex items-center justify-center">
      <form
        action={login}
        className="flex flex-col bg-white p-4 shadow-xl rounded-md gap-4"
      >
        <h1 className="text-center font-bold ">Scripti | Log in </h1>
        {searchParams?.error && (
          <p className="text-center w-[15vw] block mx-auto text-red-500">
            {message}
          </p>
        )}
        {searchParams?.status && (
          <p className="text-center w-[15vw] block mx-auto text-green-500">
            {message}
          </p>
        )}
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
    </main>
  )
}
export default Login
