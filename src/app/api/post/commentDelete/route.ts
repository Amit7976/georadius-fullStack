import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/utils";
import { Comment } from "@/src/models/commentModel";
import { auth } from "@/src/auth";
import { UserProfile } from "@/src/models/UserProfileModel";
import { Post } from "@/src/models/postModel";

async function deleteCommentWithReplies(
  commentId: string,
  deletedIds: string[]
) {
  const replies = await Comment.find({ parentCommentId: commentId });

  for (const reply of replies) {
    await deleteCommentWithReplies(reply._id.toString(), deletedIds);
  }

  deletedIds.push(commentId);
  await Comment.deleteOne({ _id: commentId });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { commentId } = await req.json();
    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const userProfile = await UserProfile.findOne({ userId }).select(
      "username"
    );
    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.username !== userProfile.username) {
      return NextResponse.json(
        { error: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    // Remove commentId from its post's comments array
    const deletedIds: string[] = [];
    await deleteCommentWithReplies(commentId, deletedIds);

    // Remove ALL those deleted commentIds from post.comments[]
    await Post.updateOne(
      { _id: comment.postId },
      { $pull: { comments: { $in: deletedIds } } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
