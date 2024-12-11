import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { unauthorized } from "next/navigation"
export const protector = async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("_scrpt")
  if (!cookie || !cookie.value) {
    unauthorized()
  }
  try {
    const { id } = jwt.verify(cookie.value, process.env.JWT_SECRET!) as {
      id: string
    }
    return id
  } catch {
    throw new Error("Internal")
  }
}
