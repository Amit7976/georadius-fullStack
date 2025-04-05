import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/utils";
import { Comment } from "@/src/models/commentModel";
import { auth } from "@/src/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const { commentId, like } = await req.json();
    if (!commentId)
      return NextResponse.json(
        { error: "commentId is required" },
        { status: 400 }
      );

    const comment = await Comment.findById(commentId);
    if (!comment)
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    // Remove current user from likes
    comment.likes = comment.likes.filter((id: string) => id !== userId);

    // If like = 1, add userId back
    let liked = false;
    if (like === 1) {
      comment.likes.push(userId);
      liked = true;
    }

    await comment.save();
    return NextResponse.json({ success: true, liked });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
