import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { Comment } from "@/src/models/commentModel";
import { Post } from "@/src/models/postModel";
import { UserProfile } from "@/src/models/UserProfileModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface UserProfileType {
  saved: string[];
}

export async function POST(req: NextRequest) {
  // console.log("========= Optimized Category Posts API =========");

  try {
    await connectToDatabase();

    const session = await auth();
    const userId = session?.user?.id;

    const body = await req.json();
    const {
      category = "All",
      lat,
      lng,
      range = 50,
      limit = 5,
      hiddenPostIds = [],
    } = body;

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Latitude and Longitude are required" },
        { status: 400 }
      );
    }

    const interestTags =
      req.cookies.get("user_interest")?.value &&
      JSON.parse(req.cookies.get("user_interest")!.value);

    const userProfile = await UserProfile.findOne(
      { userId },
      { saved: 1 }
    ).lean<UserProfileType>();

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hiddenObjectIds = hiddenPostIds.map(
      (id: string) => new mongoose.Types.ObjectId(id)
    );

    const posts = await Post.aggregate([
      {
        $match: {
          _id: { $nin: hiddenObjectIds },
          $expr: {
            $and: [
              {
                $lte: [
                  {
                    $sqrt: {
                      $add: [
                        { $pow: [{ $subtract: ["$latitude", lat] }, 2] },
                        { $pow: [{ $subtract: ["$longitude", lng] }, 2] },
                      ],
                    },
                  },
                  range / 100,
                ],
              },
              ...(category !== "All"
                ? [{ $in: [category, "$categories"] }]
                : []),
            ],
          },
        },
      },
      {
        $addFields: {
          interestMatchScore: {
            $size: {
              $setIntersection: ["$categories", interestTags || []],
            },
          },
          upvoteCount: { $size: "$upvote" },
          downvoteCount: { $size: "$downvote" },
          voteScore: {
            $subtract: [{ $size: "$upvote" }, { $size: "$downvote" }],
          },
        },
      },
      {
        $sort: {
          interestMatchScore: -1,
          voteScore: -1,
          createdAt: -1,
        },
      },
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
          creatorName: 1,
          creatorImage: 1,
          upvoteCount: 1,
          downvoteCount: 1,
          share: 1,
          categories: 1,
          commentsCount: { $size: "$comments" },
          createdAt: 1,
          isUserUpvote: { $in: [userId, "$upvote"] },
          isUserDownvote: { $in: [userId, "$downvote"] },
        },
      },
      {
        $limit: limit,
      },
    ]);

    const finalPosts = [];

    for (const post of posts) {
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

      finalPosts.push({
        ...post,
        currentUserProfile: post.userId?.toString() === userId,
        isSaved: userProfile.saved.includes(post._id.toString()),
        topComments,
      });
    }

    return NextResponse.json(
      {
        message: "Posts fetched successfully",
        posts: finalPosts,
        currentLoginUsername: session?.user.username,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Nearby Posts API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
