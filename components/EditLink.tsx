"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaEdit } from "react-icons/fa"
const EditLink: React.FC<{ _id: string; itemType: string }> = ({
  _id,
  itemType,
}) => {
  const pathname = usePathname()
  const split = pathname.split("/")
  const page = split[2]
  const major = split[3]
  let url =
    "/protected/" +
    `${page}` +
    `/${major}/` +
    `${page === "home" ? "tasks" : ""}` +
    `/edit/${_id}`
  switch (itemType) {
    case "schedule":
      url = `/protected/${page}/${major}/schedule/edit/${_id}`
      break
  }
  return (
    <Link
      href={url}
      className="flex items-center"
      scroll={false}
      aria-label="Edit"
    >
      <FaEdit />
    </Link>
  )
}
export default EditLink
