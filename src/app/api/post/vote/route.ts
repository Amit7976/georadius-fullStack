import { NextResponse } from "next/server";
import { Post } from "@/src/models/postModel";
import { auth } from "@/src/auth";

export async function POST(req: Request) {
  // console.log("====================================");
  // console.log("====== Post Upvote, Downvote =======");
  // console.log("====================================");

  // console.log("📌 [START] Processing Vote");

  try {
    const session = await auth();
    const userId = session?.user?.id;
    // console.log("🔍 Authenticated User ID:", userId);

    if (!userId) {
      console.error("[ERROR] User ID is missing!");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { postId, vote } = await req.json();
    // console.log("🔍 Post ID:", postId, "| Vote:", vote);

    if (!postId || ![0, 1, 2].includes(vote)) {
      console.error("[ERROR] Invalid Post ID or Vote Value");
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      console.error("[ERROR] Post not found");
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await Post.updateOne(
      { _id: postId },
      { $pull: { upvote: userId, downvote: userId } }
    );

    if (vote === 1) {
      await Post.updateOne({ _id: postId }, { $addToSet: { upvote: userId } });
    } else if (vote === 2) {
      await Post.updateOne(
        { _id: postId },
        { $addToSet: { downvote: userId } }
      );
    }

    // console.log("✅ Vote Updated Successfully");
    return NextResponse.json(
      { message: "Vote updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error processing vote:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
