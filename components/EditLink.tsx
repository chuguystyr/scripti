"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaEdit } from "react-icons/fa"
const EditLink: React.FC<{ _id: string }> = ({ _id }) => {
  const pathname = usePathname()
  const split = pathname.split("/")
  const page = split[2]
  const major = split[3]
  const url =
    "/protected/" +
    `${page}` +
    `/${major}/` +
    `${page === "home" ? "tasks" : ""}` +
    `/edit/${_id}`
  return (
    <Link href={url} className="flex items-center" scroll={false}>
      <FaEdit />
    </Link>
  )
}
export default EditLink
