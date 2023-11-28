import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

let cachedDb: typeof mongoose | null = null;

async function connectDB() {
  if (cachedDb) {
    console.log("Using cached database instance");
    return cachedDb;
  }
  try {
    const dbInstance = await mongoose.connect(DATABASE_URL!);
    cachedDb = dbInstance;
    return dbInstance;
  } catch (error) {
    console.error("Database connection failed", error);
    throw error;
  }
}

export default connectDB;