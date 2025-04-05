// comment/route.ts
import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { Comment } from "@/src/models/commentModel";
import { Post } from "@/src/models/postModel";
import { UserProfile } from "@/src/models/UserProfileModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("🔐 Authenticating...");
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      console.log("❌ Unauthorized - no user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔗 Connecting to DB...");
    await connectToDatabase();

    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      console.log("❌ User profile not found");
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { postId, comment, parentCommentId, replyingToUsername } = body;

    console.log("📥 Request body:", body);

    if (!postId || !comment) {
      console.log("❌ Missing required fields: postId or comment");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("📝 Creating new comment...");

    const newComment = new Comment({
      postId,
      username: userProfile.username,
      profileImage: userProfile.profileImage,
      comment,
      replyingToUsername,
      parentCommentId: parentCommentId || undefined,
    });

    await newComment.save();
    console.log("✅ Comment saved with ID:", newComment._id);

    console.log("🔄 Updating Post to include comment...");
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    if (!updatedPost) {
      console.log("⚠️ Post not found while trying to update comments");
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log("✅ Post updated with new comment ID");

    return NextResponse.json(
      {
        message: "Comment added",
        comment: newComment,
        currentUser: { username: userProfile.username },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error posting comment:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
