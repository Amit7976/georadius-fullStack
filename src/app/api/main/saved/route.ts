import { auth } from "@/src/auth";
import { UserProfile } from "@/src/models/UserProfileModel";
import { Post } from "@/src/models/postModel";
import { Comment } from "@/src/models/commentModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export async function GET() {
  try {
    // console.log("====================================");
    // console.log("======= Fetch Saved Posts ==========");
    // console.log("====================================");

    const session = await auth();
    const userId = session?.user?.id;
    const currentLoginUsername = session?.user?.username;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    interface ProfileData {
      saved: string[];
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const profileData = (await UserProfile.findOne(
      { userId },
      { saved: 1 }
    ).lean()) as ProfileData | null;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!profileData || !profileData.saved || profileData.saved.length === 0) {
      return NextResponse.json(
        { posts: [], currentLoginUsername },
        { status: 200 }
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const objectIds = profileData.saved.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const posts = await Post.aggregate([
      { $match: { _id: { $in: objectIds } } },
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
          creatorImage: 1,
          creatorName: 1,
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Add top 10 comments for each post
    const finalPosts = [];

    for (const post of posts) {
      // const topComments = await Comment.aggregate([
      //   { $match: { postId: post._id } },
      //   { $sort: { createdAt: -1 } },
      //   { $limit: 10 },
      //   {
      //     $project: {
      //       _id: 1,
      //       comment: 1,
      //       username: 1,
      //       parentCommentId: 1,
      //       replyingToUsername: 1,
      //       profileImage: 1,
      //       updatedAt: 1,
      //     },
      //   },
      // ]);

      finalPosts.push({
        ...post,
        // topComments,
        currentUserProfile: post.userId?.toString() === userId,
      });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return NextResponse.json(
      { posts: finalPosts, currentLoginUsername },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved posts." },
      { status: 500 }
    );
  }
}
