import { type ClassValue, clsx } from "clsx";
import mongoose, { connection } from "mongoose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const connectToDatabase = async () => {
  try {
    if (mongoose.Connection && mongoose.connections[0].readyState) return;

    const { connection } = await mongoose.connect(
      process.env.MONGO_URI as string,
      {
        dbName: "nextAuth",
      }
    );

    console.log("====================================");
    console.log(`Connecting to database: ${connection.host}`);
    console.log("====================================");
  } catch (error) {
    console.log("====================================");
    console.log("Error connecting to database");
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    throw new Error("Error connecting to database");
  }
};
