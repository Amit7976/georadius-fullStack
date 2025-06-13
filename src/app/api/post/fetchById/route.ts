import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/utils";
import { auth } from "@/src/auth";
import { Post } from "@/src/models/postModel";
import mongoose from "mongoose";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export async function POST(req: NextRequest): Promise<NextResponse> {
  // console.log("====================================");
  // console.log("======== Post Fetch By ID ==========");
  // console.log("====================================");

  try {
    // console.log("🔗 Connecting to DB...");
    await connectToDatabase();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const { postId } = await req.json();
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const ownsPost = post.userId?.toString() === userId;

    if (!ownsPost) {
      return NextResponse.json(
        { error: "You do not have access to this post" },
        { status: 403 }
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("[ERROR] Fetching post by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
