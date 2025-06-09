import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { User } from "@/src/models/userModel";
import { Post } from "@/src/models/postModel";
import { Comment } from "@/src/models/commentModel";
import { UserProfile } from "@/src/models/UserProfileModel";
import { Report } from "@/src/models/reportModel";
import cloudinary from "cloudinary";

// Cloudinary config
const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Extract publicId from Cloudinary URL
function extractPublicId(imageUrl: string) {
  const match = imageUrl.match(/\/([^/]+)\.\w+$/);
  return match ? match[1] : null;
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const password = body?.password;
    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userId = session.user.id;
    const username = session.user.username;

    // Get only user password
    const user = await User.findById(userId).select("password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 403 }
      );
    }

    // Get all user posts (only necessary fields)
    const userPosts = await Post.find({ userId }).select(
      "images creatorImage _id"
    );
    const postIds = userPosts.map((post) => post._id.toString());

    // 1. Delete all post images + creatorImages from Cloudinary
    for (const post of userPosts) {
      for (const img of post.images) {
        const publicId = extractPublicId(img);
        if (publicId)
          await cloudinaryV2.uploader.destroy(`news_post/${publicId}`);
      }

      const creatorImageId = extractPublicId(post.creatorImage);
      if (creatorImageId)
        await cloudinaryV2.uploader.destroy(
          `profile_pictures/${creatorImageId}`
        );
    }

    // 2. Delete reports' images
    const relatedReports = await Report.find({
      postId: { $in: postIds },
    }).select("photos");
    for (const report of relatedReports) {
      for (const photo of report.photos) {
        const publicId = extractPublicId(photo);
        if (publicId)
          await cloudinaryV2.uploader.destroy(`reports/${publicId}`);
      }
    }

    await Report.deleteMany({ postId: { $in: postIds } });

    // 3. Delete comments on posts
    await Comment.deleteMany({ username });

    // 4. Clean up from upvotes, downvotes, and reports in all posts
    await Post.updateMany(
      {},
      {
        $pull: {
          upvote: userId,
          downvote: userId,
          report: { $in: postIds },
        },
      }
    );

    // 4. Clean up from upvotes, downvotes, and reports in all comments
    await Comment.updateMany(
      {},
      {
        $pull: {
          likes: userId,
          reports: { $in: postIds },
        },
      }
    );

    // 5. Delete the posts
    await Post.deleteMany({ _id: { $in: postIds } });

    // 6. Delete profileImage from Cloudinary (if exists)
    const profile = await UserProfile.findOne({ userId }).select(
      "profileImage"
    );
    if (profile?.profileImage) {
      const publicId = extractPublicId(profile.profileImage);
      if (publicId)
        await cloudinaryV2.uploader.destroy(`profile_pictures/${publicId}`);
    }

    // 7. Remove postIds from saved[] array of all profiles
    await UserProfile.updateMany({}, { $pull: { saved: { $in: postIds } } });

    // 8. Delete user profile
    await UserProfile.deleteOne({ userId });

    // 9. Delete user account
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      message: "Account and all related data deleted successfully",
    });
  } catch (err) {
    console.error("Delete Account Error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
