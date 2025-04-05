import { auth } from "@/src/auth";
import { UserProfile } from "@/src/models/UserProfileModel";
import { Post } from "@/src/models/postModel";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    console.log("✅ Received new POST request at /api/post/new");

    // ✅ Authenticate User
    const session = await auth();
    if (!session || !session.user?.id) {
      console.log("[ERROR] User authentication failed.");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    console.log("🔑 Authenticated User ID:", userId);

    // ✅ Fetch user data
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      console.log("[ERROR] User not found in database.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("👤 User found:", {
      username: userProfile.username,
      profileImage: userProfile.profileImage,
    });

    // ✅ Parse FormData
    const formData = await req.formData();
    console.log("📩 FormData received");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);
    const categories = JSON.parse(
      (formData.get("categories") as string) || "[]"
    ) as string[];
    const images = formData.getAll("images") as File[];

    console.log("📝 Extracted Data:", {
      title,
      description,
      location,
      latitude,
      longitude,
    });
    console.log("🏷 Categories:", categories);
    console.log("🖼 Total Images Received:", images.length);

    // ✅ Upload Images to Cloudinary
    let imageUrls: string[] = [];
    for (const image of images) {
      console.log("🔄 Uploading Image:", image.name);
      const buffer = await image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      const uploadedResponse = await cloudinary.v2.uploader.upload(
        `data:${image.type};base64,${base64Image}`,
        {
          folder: "news_post",
          transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        }
      );
      imageUrls.push(uploadedResponse.secure_url);
      console.log(
        "✅ Image uploaded successfully:",
        uploadedResponse.secure_url
      );
    }

    // ✅ Create New Post
    const newPost = new Post({
      title,
      description,
      location,
      latitude,
      longitude,
      categories,
      images: imageUrls,
      creatorName: userProfile.username, // ✅ From userProfile
      creatorImage: userProfile.profileImage, // ✅ From userProfile
      upvote: [],
      downvote: [],
      report: [],
      comments: [],
      share: 0,
      createdAt: new Date(),
    });

    await newPost.save();
    console.log("✅ Post saved in database:", newPost._id);

    // ✅ Update User Profile to Store Post ID
    userProfile.posts.push(newPost._id);
    await userProfile.save();
    console.log("✅ Post ID added to user profile:", userProfile.posts);

    return NextResponse.json(
      { message: "Post created successfully", postId: newPost._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error processing request:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
