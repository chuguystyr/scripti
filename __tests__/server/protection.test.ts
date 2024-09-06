import { describe, it, expect, vi, beforeEach } from "vitest"
import jwt from "jsonwebtoken"
import { protector } from "server/protection"

vi.mock("jsonwebtoken")

describe("protector", () => {
  const mockJwtSecret = "secret"
  beforeEach(() => {
    process.env.JWT_SECRET = mockJwtSecret
  })

  it("should throw an error if token is not provided", async () => {
    await expect(protector("")).rejects.toThrow("Unathorised")
  })

  it("should call jwt.verify function with token and secret", async () => {
    const mockToken = "token"
    const mockDecoded = "123"
    vi.mocked(jwt.verify).mockReturnValue(mockDecoded as never)
    await protector(mockToken)
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET)
  })

  it("should throw an error if token is invalid", async () => {
    const mockToken = "invalid-token"
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("Invalid token")
    })

    await expect(protector(mockToken)).rejects.toThrow("Unathorised")
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockJwtSecret)
  })
})
