import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/utils";
import { Comment } from "@/src/models/commentModel";
import { Post } from "@/src/models/postModel";
import { auth } from "@/src/auth";
import { UserProfile } from "@/src/models/UserProfileModel";

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

interface PostWithComments {
  comments?: mongoose.Types.ObjectId[] | string[];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

export async function POST(req: NextRequest): Promise<NextResponse> {
  // console.log("====================================");
  // console.log("======== Post Fetch Comments ========");
  // console.log("====================================");

  try {
    // DB connect
    await connectToDatabase();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Auth check
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      // console.log("❌ Unauthorized - no session user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const userProfile = await UserProfile.findOne({ userId }, { username: 1 });
    if (!userProfile) {
      // console.log("❌ User profile not found");
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const currentUserId = userId.toString();
    const currentUsername = userProfile.username;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Request body
    const body = await req.json();
    const {
      postId,
      limit = 10,
      excludeIds = [], // 🧹 newly added
    }: {
      postId?: string;
      page?: number;
      limit?: number;
      excludeIds?: string[];
    } = body;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Get post and comment IDs
    const post = (await Post.findById(postId).lean()) as PostWithComments;

    if (!post || !post.comments || post.comments.length === 0) {
      return NextResponse.json(
        {
          comments: [],
          totalComments: 0,
          currentUser: { username: currentUsername },
        },
        { status: 200 }
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const commentObjectIds = post.comments.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const excludedObjectIds = excludeIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Aggregate filtered, sorted, paginated comments
    const commentDocs = await Comment.aggregate([
      {
        $match: {
          _id: {
            $in: commentObjectIds,
            $nin: excludedObjectIds, // 🚫 exclude already shown
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          comment: 1,
          username: 1,
          parentCommentId: 1,
          replyingToUsername: 1,
          profileImage: 1,
          updatedAt: 1,
          reports: {
            $gt: [
              {
                $size: {
                  $setIntersection: [[currentUserId], "$reports"],
                },
              },
              0,
            ],
          },
        },
      },
    ]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Format for client
    const comments = commentDocs.map((comment) => ({
      _id: comment._id,
      comment: comment.comment,
      username: comment.username,
      parentCommentId: comment.parentCommentId || null,
      replyingToUsername: comment.replyingToUsername || null,
      profileImage: comment.profileImage || null,
      updatedAt: comment.updatedAt,
      reports: comment.reports,
    }));

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return NextResponse.json(
      {
        comments,
        totalComments: commentObjectIds.length,
        currentUser: { username: currentUsername },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching post comments:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
