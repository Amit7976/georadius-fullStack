import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/utils";
import { Comment } from "@/src/models/commentModel";
import { auth } from "@/src/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {

  console.log("====================================");
  console.log("======== Post Like Comment ==========");
  console.log("====================================");

  console.log("📌 [START] Like comment");
  try {

    console.log("🔗 Connecting to DB...");
      await connectToDatabase();

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


    const { commentId, like } = await req.json();
    if (!commentId)
      return NextResponse.json(
        { error: "commentId is required" },
        { status: 400 }
      );

    
    const comment = await Comment.findById(commentId);
    if (!comment)
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });

   
    comment.likes = comment.likes.filter((id: string) => id !== userId);

    
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
