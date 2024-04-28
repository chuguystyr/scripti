"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import Logo from "public/Logo.png"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className="flex mb-5 justify-between">
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
      <ul className="hidden md:flex md:gap-10 md:my-auto">
        <li className="btn-outlined">
          <Link href="/protected/courses">Courses</Link>
        </li>
        <li className="btn-outlined">
          <Link href="/protected/tasks">Tasks</Link>
        </li>
        <li className="btn-outlined">
          <Link href="/protected/account">Account</Link>
        </li>
      </ul>
      <div className="md:hidden self-center">
        <button
          className="btn-filled w-fit"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
        <ul
          className={`${
            isOpen ? "flex" : "hidden"
          } px-2 rounded-md z-10 absolute flex-col right-5 bg-white md:static md:w-auto md:flex md:flex-row gap-3 md:gap-4 my-auto`}
        >
          <li className="mobileMenuLink">
            <Link href="/protected/courses">Courses</Link>
          </li>
          <li className="mobileMenuLink">
            <Link href="/protected/tasks">Tasks</Link>
          </li>
          <li className="mobileMenuLink">
            <Link href="/protected/account">Account</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default Navigation
