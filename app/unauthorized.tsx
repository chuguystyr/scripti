import Link from "next/link"

const Unauthorized = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold animate-bounce">401</h1>
      <p className="text-xl text-center mt-5 px-2">
        You don&apos;t have access to this page. Please login to continue.
      </p>
      <Link href="/login" className="mt-5 btn-outlined">
        Log in
      </Link>
    </main>
  )
}

export default Unauthorized
