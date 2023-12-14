import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold animate-bounce">404</h1>
      <p className="text-xl text-center mt-5 px-2">
        We&apos;re sorry, the page you are looking for cannot be found.
      </p>
      <Link href="/protected/home" className="mt-5 btn-outlined">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
