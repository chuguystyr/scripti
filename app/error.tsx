"use client"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "InternalError | Scripti",
  description: "An error occurred",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Error",
    description: "An error occurred",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Error",
    description: "An error occurred",
  },
}
const Error: React.FC<{
  error: Error & { digest?: string }
  reset: () => void
}> = ({ reset }) => {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold animate-bounce">500</h1>
      <p className="text-xl text-center mt-5 px-2">Internal Error</p>
      <button onClick={reset} className="mt-5 btn-outlined">
        Reload page
      </button>
    </main>
  )
}

export default Error
