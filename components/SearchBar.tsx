"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

const SearchBar: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams)
    const sanitizer = new RegExp(/^[a-zA-Z0-9\s]{2,}$/)
    if (value && sanitizer.test(value)) {
      params.set("query", value)
    } else {
      params.delete("query")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row items-center my-4">
      <input
        type="text"
        name="search"
        id="search"
        className="py-2 px-4 rounded-md border border-gray-300 w-full mr-5 md:w-auto"
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="flex gap-3 mt-3 md:mt-0">{children}</div>
    </div>
  )
}

export default SearchBar
