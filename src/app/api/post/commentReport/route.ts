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

    const { commentId, report } = await req.json();
    if (!commentId)
      return NextResponse.json(
        { error: "commentId is required" },
        { status: 400 }
      );

    const comment = await Comment.findById(commentId);
    if (!comment)
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    // Remove current user from reports
    comment.reports = comment.reports.filter((id: string) => id !== userId);

    // If report = 1, add userId back
    let reported = false;
    if (report === 1) {
      comment.likes.push(userId);
      reported = true;
    }

    await comment.save();
    return NextResponse.json({ success: true, reported });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
