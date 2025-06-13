import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/utils";
import { auth } from "@/src/auth";
import { Comment } from "@/src/models/commentModel";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export async function POST(req: NextRequest): Promise<NextResponse> {
  // console.log("====================================");
  // console.log("======== Post Report Comment ========");
  // console.log("====================================");

  // console.log("📌 [START] Report comment");

  try {
    // console.log("🔗 Connecting to DB...");
    await connectToDatabase();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const { commentId, report } = await req.json();
    if (!commentId)
      return NextResponse.json(
        { error: "commentId is required" },
        { status: 400 }
      );

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const comment = await Comment.findById(commentId);
    if (!comment)
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    comment.reports = comment.reports.filter((id: string) => id === userId);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    let reported = false;
    if (report === 1) {
      comment.reports.push(userId);
      reported = true;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    await comment.save();
    return NextResponse.json({ success: true, reported });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
