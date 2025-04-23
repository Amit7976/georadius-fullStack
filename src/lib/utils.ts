import { type ClassValue, clsx } from "clsx";
import mongoose from "mongoose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGO_URI as string;

    if (!uri) {
      throw new Error("Missing MONGO_URI");
    }

    cached.promise = mongoose.connect(uri, {
      dbName: "geoRadius",
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`✅ Connected to MongoDB: ${cached.conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    cached.promise = null;
    throw error;
  }

  (global as any).mongoose = cached;
  return cached.conn;
};
