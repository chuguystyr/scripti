import { describe, it, expect, vi, beforeEach } from "vitest"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { protector } from "server/protection"
import { unauthorized } from "next/navigation"

vi.mock("jsonwebtoken")
vi.mock("next/headers")
vi.mock("next/navigation")

vi.spyOn(console, "error")

describe("protector", () => {
  const mockJwtSecret = "secret"

  beforeEach(() => {
    process.env.JWT_SECRET = mockJwtSecret
    vi.resetAllMocks()
  })

  it("should call unathorized if no cookie present", async () => {
    vi.mocked(cookies).mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: (name: string) => undefined,
    } as never)
    vi.mocked(unauthorized).mockImplementation(() => {
      throw new Error("Unauthorized")
    })
    await protector().catch((error) => {
      console.log("Inside catch", error)
      expect(error.message).toBe("Unauthorized")
    })
    expect(unauthorized).toHaveBeenCalled()
  })
  it("should call unathorized if cookie is empty", async () => {
    vi.mocked(cookies).mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: (name: string) => ({ value: "" }),
    } as never)
    vi.mocked(unauthorized).mockImplementation(() => {
      throw new Error("Unauthorized")
    })
    await protector().catch((error) => {
      console.log("Inside catch", error)
      expect(error.message).toBe("Unauthorized")
    })
    expect(unauthorized).toHaveBeenCalled()
  })
  it("should verify and return decoded cookie", async () => {
    vi.mocked(cookies).mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: (name: string) => ({ value: "some-value" }),
    } as never)
    const mockDecodedCookie = { id: "some-id" }
    vi.mocked(jwt.verify).mockReturnValue(mockDecodedCookie as never)
    const id = await protector()
    expect(id).toBe(mockDecodedCookie.id)
  })
  it("should log error and call unathorized if jwt.verify throws", async () => {
    vi.mocked(cookies).mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: (name: string) => ({ value: "invalid-value" }),
    } as never)
    vi.mocked(jwt.verify).mockImplementation(() => {
      console.log("Inside jwt")
      throw new Error("Invalid token")
    })
    vi.mocked(unauthorized).mockImplementation(() => {
      console.log("Inside unathorized")
      throw new Error("Unauthorized")
    })
    await protector().catch((error) => {
      console.log("Inside catch", error)
      expect(error.message).toBe("Unauthorized")
    })
    expect(console.error).toHaveBeenCalledWith(
      "Token verification error",
      expect.any(Error),
    )
    expect(unauthorized).toHaveBeenCalled()
  })
})
