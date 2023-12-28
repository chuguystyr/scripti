"use client";
import Link from "next/link";
const Error: React.FC<{
  error: Error & { digest?: string };
  reset: () => void;
}> = ({ error, reset }) => {
  const data = { number: 0, text: "" };
  switch (error.message) {
    case "Unauthorized":
      data.number = 401;
      data.text =
        "You don't have access to this page. Please login to continue.";
      break;
    case "Internal":
      data.number = 500;
      data.text = "Something went wrong. Please try again later.";
      break;
  }
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold animate-bounce">{data.number}</h1>
      <p className="text-xl text-center mt-5 px-2">{data.text}</p>
      {data.number === 401 ?
        <Link href="/login" className="mt-5 btn-outlined">
          Log in
        </Link>
      : <button onClick={reset} className="mt-5 btn-outlined">
          Reload page
        </button>
      }
    </main>
  );
};

export default Error;
