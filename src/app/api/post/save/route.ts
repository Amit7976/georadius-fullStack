import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { UserProfile } from "@/src/models/UserProfileModel";

export async function POST(req: Request) {
  console.log("====================================");
  console.log("📌 [START] Processing Save");

  try {
    // 🔹 Authenticate User
    const session = await auth();
    const userId = session?.user?.id;
    console.log("🔍 Authenticated User ID:", userId);

    if (!userId) {
      console.error("[ERROR] User ID is missing!");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // 🔹 Parse Request Body
    const { postId, save } = await req.json();
    console.log("🔍 Post ID:", postId, "| Save:", save);

    if (!postId || (save !== 0 && save !== 1)) {
      console.error("[ERROR] Invalid Post ID or Save Value");
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // 🔹 Update User's Saved Posts
    const updateQuery =
      save === 1
        ? { $addToSet: { saved: postId } } // Add postId to saved array (prevent duplicates)
        : { $pull: { saved: postId } }; // Remove postId from saved array

    await UserProfile.updateOne({ userId: userId }, updateQuery);
    console.log("✅ Save Status Updated Successfully");

    return NextResponse.json(
      {
        message:
          save === 1 ? "Post saved successfully" : "Post removed from saved",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error processing save:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
