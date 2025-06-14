import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { Post } from "@/src/models/postModel";
import { NextRequest, NextResponse } from "next/server";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export const dynamic = "force-dynamic";

/////////////////////////////////////////////////////////////////////////////////////////////////////

export async function GET(req: NextRequest) {
  // console.log("====================================");
  // console.log("========= Nearby Posts API =========");
  // console.log("====================================");

  // console.log("📌 [START] Nearby Posts API");

  try {
    // console.log("➡️ Connecting to DB...");
    await connectToDatabase();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const session = await auth();
    const userId = session?.user?.id;
    // console.log("🔐 Authenticated User ID:", userId);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const limit = parseFloat(searchParams.get("limit") || "");

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Latitude and Longitude are required" },
        { status: 400 }
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // console.log("📍 Coordinates:", { lat, lng });

    const posts = await Post.aggregate([
      {
        $match: {
          images: { $exists: true, $ne: null },
          $expr: { $gt: [{ $size: "$images" }, 0] },
        },
      },
      {
        $addFields: {
          distance: {
            $sqrt: {
              $add: [
                { $pow: [{ $subtract: ["$latitude", lat] }, 2] },
                { $pow: [{ $subtract: ["$longitude", lng] }, 2] },
              ],
            },
          },
        },
      },
      { $sort: { distance: 1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          userId: 1,
          description: 1,
          categories: 1,
          creatorName: 1,
          creatorImage: 1,
          images: 1,
          location: 1,
          createdAt: 1,
          latitude: 1,
          longitude: 1,
          upvoteCount: { $size: "$upvote" },
          downvoteCount: { $size: "$downvote" },
          isUserUpvote: { $in: [userId, "$upvote"] },
          isUserDownvote: { $in: [userId, "$downvote"] },
        },
      },
      {
        $limit: limit,
      },
    ]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const enrichedPosts = posts.map((post) => ({
      ...post,
      currentUserProfile: userId && post.userId?.toString() === userId,
    }));

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return NextResponse.json(enrichedPosts);
  } catch (err) {
    console.error("❌ Nearby Posts API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
