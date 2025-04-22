import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { Post } from "@/src/models/postModel";
import { UserProfile } from "@/src/models/UserProfileModel";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
interface UserProfileType {
  saved: string[];
}
export async function GET(req: NextRequest) {

  console.log("====================================");
  console.log("========= Category Posts API =========");
  console.log("====================================");

  console.log("📌 [START] Nearby Posts API");

  try {

    console.log("➡️ Connecting to DB...");
    await connectToDatabase();


    const session = await auth();
    const userId = session?.user?.id;
    console.log("🔐 Authenticated User ID:", userId);

    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "All";
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const range = parseInt(searchParams.get("range") || "50");
    const limit = parseInt(searchParams.get("limit") || "5");


    if (isNaN(lat) || isNaN(lng)) {
      console.log("⚠️ Invalid latitude or longitude provided");
      return NextResponse.json(
        { error: "Latitude and Longitude are required" },
        { status: 400 }
      );
    }

    const userProfile = await UserProfile.findOne(
          { userId },
          { saved: 1 }
        ).lean<UserProfileType>();
    
        console.log("📌 UserProfile Data:", userProfile);
    
        if (!userProfile) {
          console.error("[ERROR] User not found");
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


    console.log("📍 Coordinates:", { lat, lng });
    console.log("📏 Range:", range);

    
    console.log("➡️ Fetching posts...");
  const posts = await Post.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            {
              $lte: [
                {
                  $sqrt: {
                    $add: [
                      { $pow: [{ $subtract: ["$latitude", lat] }, 2] },
                      { $pow: [{ $subtract: ["$longitude", lng] }, 2] },
                    ],
                  },
                },
                range / 100,
              ],
            },
            // ✅ Category filter (optional if not "All")
            ...(category !== "All"
              ? [
                  {
                    $in: [category, "$categories"],
                  },
                ]
              : []),
          ],
        },
      },
    },
    {
      $addFields: {
        upvoteCount: { $size: "$upvote" },
        downvoteCount: { $size: "$downvote" },
        voteScore: {
          $subtract: [{ $size: "$upvote" }, { $size: "$downvote" }],
        },
      },
    },
    {
      $sort: {
        voteScore: -1,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        userId: 1,
        description: 1,
        location: 1,
        longitude: 1,
        latitude: 1,
        images: 1,
        creatorName: 1,
        creatorImage: 1,
        upvoteCount: 1,
        downvoteCount: 1,
        share: 1,
        categories: 1,
        commentsCount: { $size: "$comments" },
        createdAt: 1,
        isUserUpvote: { $in: [userId, "$upvote"] },
        isUserDownvote: { $in: [userId, "$downvote"] },
      },
    },
    {
      $limit: limit,
    },
  ]);




    console.log("📝 Posts fetched:", posts.length);


   const enrichedPosts = posts.map((post) => ({
     ...post,
     currentUserProfile: userId && post.userId?.toString() === userId,
     isSaved: userProfile.saved.includes(post._id.toString()),
   }));



    console.log("🔚 [END] Nearby Posts API - Returning posts");

    return NextResponse.json(enrichedPosts);

  } catch (err) {

    console.error("❌ Nearby Posts API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );

  }
}
