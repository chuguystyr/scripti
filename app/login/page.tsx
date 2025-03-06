import { Metadata } from "next"
import { SearchParams } from "types/Utilities"
import LoginForm from "components/account/LoginForm"

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

const Login: React.FC<SearchParams> = async ({ searchParams }) => {
  const { status } = await searchParams
  const signedUp = status === "signedUp"
  return (
    <main className="w-[100vw] h-[100vh] bg-zinc-300 flex items-center justify-center">
      <LoginForm signedUp={signedUp} />
    </main>
  )
}
export default Login
