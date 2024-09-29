import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 - Page Not Found | Scripti",
  description:
    "We're sorry, but the page you are looking for cannot be found. Please return to the home page or try another link.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "404 - Page Not Found | Scripti",
    description:
      "Oops! The page you're looking for doesn't exist. Let's get you back on track.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "404 - Page Not Found | Scripti",
    description:
      "Oops! The page you're looking for doesn't exist. Let's get you back on track.",
  },
}

const NotFoundPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold animate-bounce">404</h1>
      <p className="text-xl text-center mt-5 px-2">
        We&apos;re sorry, the page you are looking for cannot be found.
      </p>
      <Link href="/protected/home" className="mt-5 btn-outlined">
        Back to Home
      </Link>
    </main>
  )
}

export default NotFoundPage
