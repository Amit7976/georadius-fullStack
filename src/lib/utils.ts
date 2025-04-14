import { type ClassValue, clsx } from "clsx";
import mongoose, { connection } from "mongoose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "geoRadius",
    });

    isConnected = true;

    console.log("====================================");
    console.log(`✅ Connected to MongoDB: ${db.connection.host}`);
    console.log("====================================");
  } catch (error) {
    console.log("====================================");
    console.log("❌ Error connecting to MongoDB:");
    console.log(error);
    console.log("====================================");
    throw new Error("MongoDB connection failed");
  }
};