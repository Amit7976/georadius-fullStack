// app/api/get-news-locations/route.ts
import { connectToDatabase } from "@/src/lib/utils";
import { Post } from "@/src/models/postModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase(); // Connect to your database

    // Fetch only required fields from Post collection
    const posts = await Post.find({}, "_id title latitude longitude");

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("[GET_NEWS_LOCATIONS_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news locations" },
      { status: 500 }
    );
  }
}
