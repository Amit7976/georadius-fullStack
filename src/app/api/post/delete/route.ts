import { auth } from "@/src/auth";
import { Post } from "@/src/models/postModel";
import { User } from "@/src/models/userModel";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { UserProfile } from "@/src/models/UserProfileModel";
import { Comment } from "@/src/models/commentModel";
import mongoose from "mongoose";

const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Recursive function to delete comment and all its replies
async function deleteCommentWithReplies(
  commentId: string,
  deletedIds: string[]
) {
  const replies = await Comment.find({ parentCommentId: commentId });

  for (const reply of replies) {
    await deleteCommentWithReplies(reply._id.toString(), deletedIds);
  }

  deletedIds.push(commentId);
  await Comment.deleteOne({ _id: commentId });
}

interface DeleteRequest {
  postId: string;
}

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const postId = body.postId?.trim();

    console.log(`[INFO] Received request to delete post: ${postId}`);

    // ✅ Validate postId
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      console.log("[ERROR] Invalid post ID");
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!session || !userId) {
      console.log("[ERROR] User authentication failed.");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log(`[INFO] Authenticated user: ${userId}`);

    // ✅ Find the post in MongoDB
    const post = await Post.findById(postId, {
      creatorName: 1,
      saved: 1,
      images: 1,
      comments: 1,
    });

    if (!post) {
      console.log("[ERROR] Post not found.");
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const user = await UserProfile.findOne({ userId }, { username: 1 });

    // ✅ Ensure the current user is the creator of the post
    if (post.creatorName !== user?.username) {
      console.log("[ERROR] Unauthorized: User is not the post creator.");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log("[INFO] User is the creator. Proceeding with deletion...");

    // ✅ Step 1: Delete all comments + replies related to this post
    if (post.comments && post.comments.length > 0) {
      const deletedIds: string[] = [];

      for (const commentId of post.comments) {
        await deleteCommentWithReplies(commentId.toString(), deletedIds);
      }

      console.log(
        `[INFO] Deleted ${deletedIds.length} comments from this post.`
      );
    }

    // ✅ Step 2: Delete images from Cloudinary
    if (post.images?.length > 0) {
      try {
        await Promise.all(
          post.images.map(async (imageUrl: string) => {
            const publicIdMatch = imageUrl.match(/\/([^/]+)\.\w+$/);
            const publicId = publicIdMatch ? publicIdMatch[1] : null;
            if (publicId) {
              await cloudinaryV2.uploader.destroy(`news_post/${publicId}`);
              console.log(
                `[SUCCESS] Deleted image from Cloudinary: ${publicId}`
              );
            }
          })
        );
      } catch (deleteError) {
        console.error(
          "[ERROR] Failed to delete Cloudinary images:",
          deleteError
        );
      }
    } else {
      console.log("[INFO] No images found for this post.");
    }

    // ✅ Step 3: Remove post ID from user's posts array
    const updatedUserProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { posts: postId } }
    );

    console.log("[INFO] Post removed from user's profile:", updatedUserProfile);

    // ✅ Step 4: Remove post ID from saved list of other users
    const updatedUsers = await UserProfile.updateMany(
      { saved: postId },
      { $pull: { saved: postId } }
    );

    console.log(`[DEBUG] Users updated: ${updatedUsers.modifiedCount}`);

    // ✅ Step 5: Delete the post itself
    await Post.findByIdAndDelete(postId);

    console.log("[SUCCESS] Post deleted successfully from database.");

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ERROR] Deleting post failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
