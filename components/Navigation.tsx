"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Logo from "@/public/Logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="flex mb-5">
      <Link href="/protected/home">
        <Image
          src={Logo}
          width={512}
          height={206}
          alt="logo"
          className="w-40 h-30 rounded-xl"
          priority
        />
      </Link>
      <ul className="hidden md:flex md:gap-10 md:my-auto md:ml-10">
        <li className="btn-outlined">
          <Link href="/protected/courses">Courses</Link>
        </li>
        <li className="btn-outlined w-[5vw] text-center">
          <Link href="/protected/tasks">Tasks</Link>
        </li>
        <li className="btn-outlined">
          <Link href="/protected/account">Account</Link>
        </li>
      </ul>
      <div className="md:hidden self-center ml-[35vw]">
        <button
          className="btn-filled"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
        <ul
          className={`${
            isOpen ? "flex" : "hidden"
          } z-10 absolute flex-col right-5 bg-white md:static md:w-auto md:flex md:flex-row gap-5 md:gap-10 my-auto`}
        >
          <li className="font-bold hover:text-gray-700 transition-colors duration-300 px-4 py-2">
            <Link href="/protected/courses">Courses</Link>
          </li>
          <li className="font-bold hover:text-gray-700 transition-colors duration-300 px-4 py-2">
            <Link href="/protected/tasks">Tasks</Link>
          </li>
          <li className="font-bold hover:text-gray-700 transition-colors duration-300 px-4 py-2">
            <Link href="/protected/account">Account</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navigation;
