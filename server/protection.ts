import jwt from "jsonwebtoken"
export const protector = async (token: string) => {
  if (!token) {
    throw new Error("Unathorised")
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
    }
    return id
  } catch {
    throw new Error("Unathorised")
  }
}
