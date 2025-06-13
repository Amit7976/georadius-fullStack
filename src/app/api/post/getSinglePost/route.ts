import { NextResponse } from "next/server";
import { Post } from "@/src/models/postModel";
import { Comment } from "@/src/models/commentModel";
import { auth } from "@/src/auth";
import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/utils";

export async function POST(req: Request) {
  // console.log("====================================");
  // console.log("======== Post Fetch Single =========");
  // console.log("====================================");

  try {
    await connectToDatabase();

    const session = await auth();
    const userId = session?.user?.id;
    const currentLoginUsername = session?.user?.username;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { postId } = await req.json();
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "Invalid or missing postId" },
        { status: 400 }
      );
    }

    const postObjectId = new mongoose.Types.ObjectId(postId);

    const postResult = await Post.aggregate([
      { $match: { _id: postObjectId } },
      {
        $addFields: {
          upvoteCount: { $size: "$upvote" },
          downvoteCount: { $size: "$downvote" },
          commentsCount: { $size: "$comments" },
          isUserUpvote: { $in: [userId, "$upvote"] },
          isUserDownvote: { $in: [userId, "$downvote"] },
        },
      },
      {
        $lookup: {
          from: "userprofiles",
          let: {
            postIdStr: { $toString: "$_id" },
            userObjId: new mongoose.Types.ObjectId(userId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userObjId"],
                },
              },
            },
            {
              $project: {
                isSaved: { $in: ["$$postIdStr", "$saved"] },
              },
            },
          ],
          as: "savedInfo",
        },
      },
      {
        $addFields: {
          isSaved: {
            $cond: {
              if: { $gt: [{ $size: "$savedInfo" }, 0] },
              then: { $arrayElemAt: ["$savedInfo.isSaved", 0] },
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          location: 1,
          longitude: 1,
          latitude: 1,
          images: 1,
          categories: 1,
          creatorName: 1,
          creatorImage: 1,
          userId: 1,
          share: 1,
          createdAt: 1,
          upvoteCount: 1,
          downvoteCount: 1,
          commentsCount: 1,
          isUserUpvote: 1,
          isUserDownvote: 1,
          isSaved: 1,
        },
      },
    ]);

    const post = postResult[0];
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const currentUserProfile = post.userId?.toString() === userId;

    // 🧠 Fetch top 10 comments for this post
    const topComments = await Comment.aggregate([
      { $match: { postId: post._id } },
      { $sort: { createdAt: -1 } },
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
        },
      },
    ]);

    delete post.userId;

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        currentUserProfile,
        topComments,
      },
      currentLoginUsername,
    });
  } catch (error) {
    console.error("❌ Error fetching single post:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
