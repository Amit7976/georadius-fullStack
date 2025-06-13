import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { UserProfile } from "@/src/models/UserProfileModel";
import { Post } from "@/src/models/postModel";
import { Comment } from "@/src/models/commentModel";
import { auth } from "@/src/auth";

export async function POST(req: Request) {
  try {
    console.log("====================================");
    console.log("===== Fetch Posts by creatorName ===");
    console.log("====================================");

    const session = await auth();
    const userId = session?.user?.id;
    const sessionUsername = session?.user?.username;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { username } = await req.json();
    if (!username)
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );

    // ✅ Get user profile (excluding username from DB, we’ll inject it manually)
    const profileData = await UserProfile.findOne(
      { username },
      {
        fullname: 1,
        profileImage: 1,
        bio: 1,
        location: 1,
      }
    ).lean();

    if (!profileData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Add username manually to user profile
    const userProfile = {
      ...profileData,
      username,
      currentUserProfile: username === sessionUsername,
    };

    // ✅ Aggregate posts with only counts, no full arrays
    const posts = await Post.aggregate([
      { $match: { creatorName: username } },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          userId: 1,
          description: 1,
          location: 1,
          longitude: 1,
          latitude: 1,
          images: 1,
          creatorImage: 1, // we'll add creatorName manually
          share: 1,
          categories: 1,
          createdAt: 1,
          upvoteCount: { $size: "$upvote" },
          downvoteCount: { $size: "$downvote" },
          commentsCount: { $size: "$comments" },
          isUserUpvote: { $in: [userId, "$upvote"] },
          isUserDownvote: { $in: [userId, "$downvote"] },
        },
      },
    ]);

    // ✅ Add top comments & creatorName
    const finalPosts = [];

    for (const post of posts) {
      const topComments = await Comment.aggregate([
        { $match: { postId: post._id } },
        { $addFields: { likesCount: { $size: "$likes" } } },
        { $sort: { likesCount: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 1,
            comment: 1,
            username: 1,
            parentCommentId: 1,
            replyingToUsername: 1,
            profileImage: 1,
            updatedAt: 1,
            likesCount: 1,
          },
        },
      ]);

      finalPosts.push({
        ...post,
        creatorName: username,
        currentUserProfile: post.userId?.toString() === userId,
        topComments,
      });
    }
    
    return NextResponse.json(
      {
        message: "Posts fetched successfully",
        user: userProfile,
        posts: finalPosts,
        currentLoginUsername: session?.user.username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
