import { beforeEach, describe, expect, it, vi } from "vitest"
import mongoose, { Mongoose } from "mongoose"
import connectDB from "server/db"

vi.spyOn(mongoose, "connect")
describe("connectDB", () => {
  beforeEach(() => {
    process.env.DATABASE_URL = "mongodb://localhost:27017/testdb"
    vi.clearAllMocks()
  })

  it("should throw an error if DATABASE_URL is not defined", async () => {
    delete process.env.DATABASE_URL
    await expect(connectDB()).rejects.toThrow(
      "Please define the DATABASE_URL environment variable",
    )
  })

  it("should log an error if the database connection fails", async () => {
    const connectionError = new Error("Error connecting to the database")
    vi.mocked(mongoose.connect).mockRejectedValue(connectionError)
    expect(connectDB()).rejects.toThrow()
  })

  it("should establish a new database connection if no cached instance is available", async () => {
    const dbInstanceMock1 = new Mongoose()
    vi.mocked(mongoose.connect).mockResolvedValueOnce(dbInstanceMock1)
    const DBInstance = await connectDB()
    expect(DBInstance).toBe(dbInstanceMock1)
    expect(mongoose.connect).toHaveBeenCalledTimes(1)
  })

  it("should use the cached database instance if available", async () => {
    const dbInstanceMock1 = new Mongoose()
    const dbInstanceMock2 = new Mongoose()
    vi.mocked(mongoose.connect).mockResolvedValueOnce(dbInstanceMock1)
    const firstDBInstance = await connectDB()
    vi.mocked(mongoose.connect).mockResolvedValueOnce(dbInstanceMock2)
    vi.spyOn(mongoose.connection, "readyState", "get").mockReturnValueOnce(1)
    const secondDBInstance = await connectDB()
    expect(firstDBInstance).not.toBe(dbInstanceMock2)
    expect(firstDBInstance).toBe(secondDBInstance)
    expect(mongoose.connect).toHaveBeenCalledTimes(1)
  })
})
