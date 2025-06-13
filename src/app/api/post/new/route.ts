import { auth } from "@/src/auth";
import { UserProfile } from "@/src/models/UserProfileModel";
import { Post } from "@/src/models/postModel";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { connectToDatabase } from "@/src/lib/utils";


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {

  // console.log("====================================");
  // console.log("======== New Post API ============");
  // console.log("====================================");

  try {
    // console.log("🔗 Connecting to database...");
    await connectToDatabase();

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      // console.log("[ERROR] User authentication failed.");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    // console.log("🔑 Authenticated User ID:", userId);


    const userProfile = await UserProfile.findOne({ userId }).select(
      "username profileImage"
    );
    if (!userProfile) {
      // console.log("[ERROR] User not found in database.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // console.log("👤 User found:", {
    //   username: userProfile.username,
    //   profileImage: userProfile.profileImage,
    // });

    
    const formData = await req.formData();
    // console.log("📩 FormData received");


    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);
    const categories = JSON.parse(
      (formData.get("categories") as string) || "[]"
    ) as string[];
    const images = formData.getAll("images") as File[];


    // console.log("📝 Extracted Data:", {
    //   title,
    //   description,
    //   location,
    //   latitude,
    //   longitude,
    // });
    // console.log("🏷 Categories:", categories);
    // console.log("🖼 Total Images Received:", images.length);

   
    const imageUrls: string[] = await Promise.all(
      images.map(async (image) => {
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
        // console.log("✅ Image uploaded:", uploadedResponse.secure_url);
        return uploadedResponse.secure_url;
      })
    );


    const newPost = await Post.create({
      title,
      userId,
      description,
      location,
      latitude,
      longitude,
      categories,
      images: imageUrls,
      creatorName: userProfile.username,
      creatorImage: userProfile.profileImage,
      upvote: [],
      downvote: [],
      report: [],
      comments: [],
      share: 0,
      createdAt: new Date(),
    });

    // console.log("✅ Post saved in database:", newPost._id);

    
    await UserProfile.updateOne({ userId }, { $push: { posts: newPost._id } });
    // console.log("✅ Post ID pushed to user profile");

    return NextResponse.json(
      { message: "Post created successfully", postId: newPost._id },
      { status: 201 }
    );

  } catch (error) {

    console.error("❌ Error processing request:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });

  }
}
