import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/utils";
import { Comment } from "@/src/models/commentModel";
import { Post } from "@/src/models/postModel";
import { auth } from "@/src/auth";
import { UserProfile } from "@/src/models/UserProfileModel";

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("====================================");
  console.log("======== Post Fetch Comments ========");
  console.log("====================================");

  console.log("📌 [START] Fetching post comments");

  try {
    console.log("🔗 Connecting to DB...");
    await connectToDatabase();

    console.log("🔐 Authenticating...");
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      console.log("❌ Unauthorized - no user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const userProfile = await UserProfile.findOne({ userId },{ username: 1 });
    if (!userProfile) {
      console.log("❌ User profile not found");
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const currentUserId = userId;
    const currentUsername = userProfile.username;


    console.log("👤 Current user:", currentUsername);
    console.log("👤 Current user:", currentUserId);
    console.log("👤 CurrentUserId type:", typeof currentUserId);


    const body = await req.json();
    const { postId } = body;

    if (!postId) {
      console.log("❌ postId missing in request");
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }


    console.log("🔍 Finding post by ID:", postId);
    const post = (await Post.findById(postId).lean()) as { comments?: any[] };


    if (!post) {
      console.log("❌ Post not found");
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }


    if (!post.comments || post.comments.length === 0) {
      console.log("ℹ️ Post has no comments");
      return NextResponse.json({ comments: [] }, { status: 200 });
    }


    const commentObjectIds = post.comments.map(
      (id: any) => new mongoose.Types.ObjectId(id)
    );


    let stringCurrentUserId = currentUserId.toString();
    console.log("stringCurrentUserId:", stringCurrentUserId);


    const commentDocs = await Comment.aggregate([
      {
        $match: {
          _id: { $in: commentObjectIds },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $project: {
          _id: 1,
          comment: 1,
          username: 1,
          parentCommentId: 1,
          replyingToUsername: 1,
          profileImage: 1,
          updatedAt: 1,
          likes: {
            $gt: [
              {
                $size: {
                  $setIntersection: [[stringCurrentUserId], "$likes"],
                },
              },
              0,
            ],
          },
          reports: {
            $gt: [
              {
                $size: {
                  $setIntersection: [[stringCurrentUserId], "$reports"],
                },
              },
              0,
            ],
          },
        },
      },
    ]);


    const comments = commentDocs.map((comment) => ({
      _id: comment._id,
      comment: comment.comment,
      username: comment.username,
      parentCommentId: comment.parentCommentId || null,
      replyingToUsername: comment.replyingToUsername || null,
      profileImage: comment.profileImage || null,
      updatedAt: comment.updatedAt,
      likes: comment.likes,
      reports: comment.reports,
    }));


    console.log("✅ Processed comments:", comments.length);


    return NextResponse.json(
      { comments, currentUser: { username: currentUsername } },
      { status: 200 }
    );

  } catch (error) {

    console.error("❌ Error fetching post comments:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });

  }
}
