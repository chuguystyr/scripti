import SignUpForm from "components/account/SignUpForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | Scripti",
  description:
    "Create your Scripti account to start organizing your studies more effectively. Join our community of students and boost your productivity today!",
  keywords: [
    "sign up",
    "create account",
    "Scripti",
    "student planner",
    "study organization",
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Join Scripti: Sign Up Now",
    description:
      "Take control of your studies with Scripti. Sign up for free and start planning smarter!",
    type: "website",
    siteName: "Scripti",
  },
  twitter: {
    card: "summary",
    title: "Sign Up for Scripti",
    description:
      "Create your Scripti account and revolutionize the way you plan your studies. Join now!",
  },
}

const SignUp = () => {
  return (
    <main className="w-[100vw] h-[100vh] bg-zinc-300 flex items-center justify-center">
      <SignUpForm />
    </main>
  )
}
export default SignUp
