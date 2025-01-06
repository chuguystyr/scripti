import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { unauthorized } from "next/navigation"
import { DecodedCookieObject } from "types/Utilities"
export const protector = async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("_scrpt")
  if (!cookie || !cookie.value) {
    unauthorized()
  }
  try {
    const { id } = jwt.verify(
      cookie.value,
      process.env.JWT_SECRET!,
    ) as DecodedCookieObject
    return id
  } catch (error) {
    console.error("Token verification error", error)
    unauthorized()
  }
}
