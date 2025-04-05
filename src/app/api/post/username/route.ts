import { NextResponse } from "next/server";
import { UserProfile } from "@/src/models/UserProfileModel";
import { Post } from "@/src/models/postModel";
import { auth } from "@/src/auth";
import mongoose from "mongoose";

export async function POST(req: Request) {
  console.log("====================================");
  console.log("📌 [START] Fetching user posts");

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
    const { username } = await req.json();
    console.log("🔍 Fetching profile for username:", username);

    if (!username) {
      console.error("[ERROR] Username is required");
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // 🔹 Fetch User Profile
    interface UserProfileType {
      _id: string;
      posts: string[];
      saved: string[];
    }

    const userProfile = await UserProfile.findOne(
      { username },
      { _id: 1, posts: 1, saved: 1 }
    ).lean<UserProfileType>(); // ✅ Convert Mongoose document to a plain object

    console.log("📌 UserProfile Data:", userProfile);

    if (!userProfile) {
      console.error("[ERROR] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔹 Extract & Validate Post IDs
    const postIds = Array.isArray(userProfile.posts) ? userProfile.posts : [];
    console.log("✅ User's Posts IDs:", postIds);

    if (postIds.length === 0) {
      console.log("⚠️ No posts found for user");
      return NextResponse.json(
        { message: "No posts found", posts: [] },
        { status: 200 }
      );
    }

    // 🔹 Extract Saved Post IDs
    const savedIds = Array.isArray(userProfile.saved)
      ? userProfile.saved.map((id) => id.toString())
      : [];
    console.log("✅ User's Saved Posts IDs:", savedIds);

    // 🔹 Fetch Posts from Database
    console.log("🔄 Fetching posts from DB...");
    const posts = await Post.find(
      { _id: { $in: postIds } },
      {
        _id: 1,
        title: 1,
        description: 1,
        location: 1,
        longitude: 1,
        latitude: 1,
        images: 1,
        creatorName: 1,
        creatorImage: 1,
        upvoteCount: { $size: "$upvote" },
        downvoteCount: { $size: "$downvote" },
        share: 1,
        commentsCount: { $size: "$comments" },
        createdAt: 1,
        isUserUpvote: { $in: [userId, "$upvote"] },
        isUserDownvote: { $in: [userId, "$downvote"] },
      }
    ).sort({ createdAt: -1 });

    console.log("✅ Posts fetched successfully, Count:", posts.length);

    // 🔹 Process & Check if Post is Saved
    const finalPosts = posts.map((post) => {
      const postIdStr = post._id.toString();
      const isSaved = savedIds.includes(postIdStr); // ✅ Directly check if post ID exists in saved

      console.log(`🔎 Checking Post ID: ${postIdStr}, isSaved: ${isSaved}`);

      return {
        ...post.toObject(), // Convert Mongoose document to plain object
        isSaved,
      };
    });

    console.log("✅ Final Posts Processed, Sending Response");

    return NextResponse.json(
      { message: "Posts retrieved successfully", posts: finalPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
