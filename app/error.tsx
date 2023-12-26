"use client";
import Link from "next/link";
const Error: React.FC<{}> = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-6xl font-bold text-gray-800">
        Oops, an error occured
      </h1>
      <p className="mt-3 text-xl">
        Sorry for the trouble
        <br />
        We are already taking action.
      </p>
      <Link href="/" className="mt-5 btn-outlined-gray">
        Go back home
      </Link>
    </div>
  );
};

export default Error;
