import { ReactElement } from "react"
import { cookies } from "next/headers"

const WithProtection: React.FC<{ children: ReactElement }> = async ({ children }) => {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get(
    "_scrpt",
  )?.value
  if (!isAuthenticated) {
    throw new Error("Unauthorized")
  }
  return <>{children}</>
}

export default WithProtection
