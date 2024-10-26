import { ReactElement } from "react"
import { cookies, type UnsafeUnwrappedCookies } from "next/headers"

const WithProtection: React.FC<{ children: ReactElement }> = ({ children }) => {
  const isAuthenticated = (cookies() as unknown as UnsafeUnwrappedCookies).get(
    "_scrpt",
  )?.value
  if (!isAuthenticated) {
    throw new Error("Unauthorized")
  }
  return <>{children}</>
}

export default WithProtection
