import { NextResponse } from "next/server";
import { Post } from "@/src/models/postModel";

export async function POST(req: Request) {
  console.log("====================================");
  console.log("📌 [START] Processing Share");

  try {
    // 🔹 Parse Request Body
    const { postId } = await req.json();
    console.log("🔍 Post ID:", postId);

    if (!postId) {
      console.error("[ERROR] Invalid Post ID");
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // 🔹 Increment Share Count
    await Post.updateOne({ _id: postId }, { $inc: { share: 1 } });
    console.log("✅ Share Count Updated Successfully");

    return NextResponse.json(
      { message: "Share count updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error processing share:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
