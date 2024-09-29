"use client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Loading... | Scripti",
  description: "Please wait while we prepare your content.",
  robots: "noindex, nofollow",
}

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="text-4xl mr-2 animate-spin">💡</span>
      <span className="scripti text-4xl animate-pulse">Scripti</span>
    </div>
  )
}

export default Loader
