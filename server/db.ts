import mongoose from "mongoose"

let cachedDb: null | typeof mongoose = null

async function connectDB() {
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    throw new Error("Please define the DATABASE_URL environment variable")
  }

  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb
  }

  try {
    const dbInstance = await mongoose.connect(DATABASE_URL!, {
      minPoolSize: 10,
      maxPoolSize: 25,
    })
    cachedDb = dbInstance
    return dbInstance
  } catch (error) {
    throw new Error("Error connecting to the database")
  }
}

export default connectDB
