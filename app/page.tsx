import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Scirpti: A New Approach to Planning Your Studies",
  description:
    "Get everything you need at hand any time: from schedules and tasks to notes. Streamline your study process with our comprehensive tool designed for student success.",
  keywords: [
    "study planner",
    "student app",
    "task management",
    "scheduling",
    "education",
  ],
  openGraph: {
    title: "Scirpti: Revolutionize Your Study Routine",
    description:
      "Efficient scheduling, task management, and note-taking all in one place. Start planning smarter today!",
    images: [
      { url: "/Logo.png", width: 512, height: 206, alt: "StudyPlanner Logo" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scripti: Your All-in-One Study Companion",
    description:
      "Organize your classes, assignments, and exams with ease. Join now and boost your academic performance!",
    images: ["/Logo.png"],
  },
}

const Main: React.FC = () => {
  return (
    <>
      <nav className="flex flex-row p-3 md:p-5 justify-between items-center">
        <Image
          src="/Logo.png"
          alt="logo"
          width={512}
          height={206}
          className="w-36 h-auto md:w-38 lg:w-40 rounded-xl"
          priority
        />
        <ul className="flex flex-row gap-5 md:gap-10 items-center">
          <li className="btn-outlined">
            <Link href="/login">Login</Link>
          </li>
          <li className="btn-outlined">
            <Link href="/signup">Sign Up</Link>
          </li>
        </ul>
      </nav>
      <main className="text-center px-4 md:px-10">
        <h1 className="text-4xl md:text-6xl font-bold font-mono mb-3">
          Another approach <br />
          to planning your studies
        </h1>
        <h2 className="text-md md:text-lg font-sans">
          Get everything you need at hand any time: from schedules and tasks to
          notes
        </h2>
        <section className="mt-8 md:mt-10">
          <h3 className="text-2xl md:text-3xl font-semibold mb-3">
            Why Choose Our App?
          </h3>
          <p className="mb-4">
            Streamline your study process with a comprehensive tool designed for
            student success.
          </p>
          <article className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold">Efficient Scheduling</h4>
              <p>Organize your classes, assignments, and exams with ease.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold">Task Management</h4>
              <p>Keep track of your daily tasks and long-term goals.</p>
            </div>
          </article>
          <Link href="/signup" className="btn-outlined">
            Get Started
          </Link>
        </section>
      </main>
    </>
  )
}

export default Main
