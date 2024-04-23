import jwt from "jsonwebtoken"
export const protector = async (token: string) => {
  if (!token) {
    throw new Error("Unathorised")
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
    }
    return decoded
  } catch (error) {
    throw new Error("Unathorised")
  }
}
