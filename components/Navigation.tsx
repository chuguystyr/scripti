import Link from "next/link"
import ClickableLogo from "components/ClickableLogo"
import MajorsTumbler from "components/MajorsTumbler"
import { Params } from "types/Utilities"

const Navigation: React.FC<Params> = async ({ params }) => {
  const index = Number((await params).major)
  return (
    <nav
      className="flex mb-5 justify-between items-center gap-4"
      role="navigation"
    >
      <ClickableLogo major={index} />
      <MajorsTumbler />
      <ul className="hidden md:flex md:gap-10 md:my-auto">
        <li className="btn-outlined">
          <Link href={`/protected/courses/${index}`}>Courses</Link>
        </li>
        <li className="btn-outlined">
          <Link href={`/protected/tasks/${index}`}>Tasks</Link>
        </li>
        <li className="btn-outlined">
          <Link href="/protected/account">Account</Link>
        </li>
      </ul>
      <div className="md:hidden self-center">
        <input type="checkbox" id="menu-toggle" className="hidden peer" />
        <label htmlFor="menu-toggle" className="cursor-pointer">
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>
        </label>
        <ul className="hidden card peer-checked:mobileLinks">
          <li className="mobileLink">
            <Link href={`/protected/courses/${index}`}>Courses</Link>
          </li>
          <li className="mobileLink">
            <Link href={`/protected/tasks/${index}`}>Tasks</Link>
          </li>
          <li className="mobileLink">
            <Link href="/protected/account">Account</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default Navigation
