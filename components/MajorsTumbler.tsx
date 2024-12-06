"use client"
import { getAccount } from "server/actions/account"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
const MajorsTumbler: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const index = Number(pathname.split("/").at(3))
  const [majors, setMajors] = useState<string[]>([])
  useEffect(() => {
    const fetch = async () => {
      const { majors } = await getAccount()
      setMajors(majors)
    }
    fetch()
  }, [])
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.value
    router.push(`/protected/home/${index}`)
  }
  return (
    <>
      {majors.length > 1 && (
        <select
          name=""
          id=""
          className="card w-[40%] md:w-fit"
          onChange={handleSelect}
          defaultValue={index}
        >
          {majors.map((major, i) => (
            <option key={major} value={i}>
              {major}
            </option>
          ))}
        </select>
      )}
    </>
  )
}

export default MajorsTumbler
