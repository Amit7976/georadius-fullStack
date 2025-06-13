import { NextResponse } from "next/server";
import { Post } from "@/src/models/postModel";
import { auth } from "@/src/auth";
import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/utils";

export async function POST(req: Request) {
  console.log("====================================");
  console.log("======== Post Fetch Single ==========");
  console.log("====================================");

  try {
    console.log("🔗 Connecting to DB...");
    await connectToDatabase();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    console.log("🔐 Authenticated User ID:", userId);

    const { postId } = await req.json();
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "Invalid or missing postId" },
        { status: 400 }
      );
    }

    // ✅ Fetch post and calculate required fields
    const postResult = await Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(postId) } },
      {
        $addFields: {
          upvoteCount: { $size: "$upvote" },
          downvoteCount: { $size: "$downvote" },
          commentsCount: { $size: "$comments" },
          isUserUpvote: { $in: [userId, "$upvote"] },
          isUserDownvote: { $in: [userId, "$downvote"] },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          location: 1,
          longitude: 1,
          latitude: 1,
          images: 1,
          categories: 1,
          creatorName: 1,
          creatorImage: 1,
          userId: 1,
          share: 1,
          createdAt: 1,
          upvoteCount: 1,
          downvoteCount: 1,
          commentsCount: 1,
          isUserUpvote: 1,
          isUserDownvote: 1,
        },
      },
    ]);

    const post = postResult[0];
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }


    const currentUserProfile = post.userId?.toString() === userId;


    delete post.userId;

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        currentUserProfile,
      },
      currentLoginUsername: session?.user.username,
    });
  } catch (error) {
    console.error("❌ Error fetching single post:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
