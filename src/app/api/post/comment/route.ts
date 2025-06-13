import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { Comment } from "@/src/models/commentModel";
import { Post } from "@/src/models/postModel";
import { UserProfile } from "@/src/models/UserProfileModel";
import { NextResponse } from "next/server";

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export async function POST(req: Request) {
  // console.log("====================================");
  // console.log("======== Post Comment API ==========");
  // console.log("====================================");

  // console.log("📝 POST request received at /api/post/comment");
  // console.log("📌 [START] Posting comment");

  try {
    // console.log("🔗 Connecting to DB...");
    await connectToDatabase();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // console.log("🔐 Authenticating...");
    const session = await auth();
    const userId = session?.user?.id;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!userId) {
      // console.log("❌ Unauthorized - no user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const userProfile = await UserProfile.findOne(
      { userId },
      { username: 1, profileImage: 1 }
    );
    if (!userProfile) {
      // console.log("❌ User profile not found");
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const body = await req.json();
    const { postId, comment, parentCommentId, replyingToUsername } = body;

    // console.log("📥 Request body:", body);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!postId || !comment) {
      // console.log("❌ Missing required fields: postId or comment");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // console.log("📝 Creating new comment...");
    const newComment = new Comment({
      postId,
      username: userProfile.username,
      profileImage: userProfile.profileImage,
      comment,
      replyingToUsername,
      parentCommentId: parentCommentId || undefined,
    });

    await newComment.save();
    // console.log("Comment saved with ID:", newComment._id);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // console.log("🔄 Updating Post to include comment...");
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    // console.log("Post updated with new comment");

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // console.log("Post updated with new comment ID");

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
