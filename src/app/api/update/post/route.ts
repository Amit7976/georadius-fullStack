import { auth } from "@/src/auth";
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
  // console.log("======== Update Post API ========");
  // console.log("====================================");

  try {
    // console.log("🔗 Connecting to database...");
    await connectToDatabase();

    // console.log("📩 POST request received at /api/post/update");

    const session = await auth();
    if (!session || !session.user?.id) {
      // console.log("❌ Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    // console.log("✅ User authenticated:", userId);
    // console.log("🔑 User authenticated successfully");

    const formData = await req.formData();
    // console.log("📦 FormData received");

    const postId = formData.get("postId") as string;
    if (!postId) {
      // console.log("❌ postId is missing in FormData");
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    // console.log("🆔 postId:", postId);

    // console.log("✅ User owns post");

    const post = await Post.findById(postId);
    if (!post) {
      // console.log("❌ Post not found in DB:", postId);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // console.log("📄 Post found in DB:", post.title);

    if (!post.userId.equals(userId)) {
      // console.log("❌ User does not own this post:", postId);
      return NextResponse.json({ error: "Permission denied" }, { status: 404 });
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    // const latitude = parseFloat(formData.get("latitude") as string);
    // const longitude = parseFloat(formData.get("longitude") as string);
    const latitudeRaw = formData.get("latitude");
    const longitudeRaw = formData.get("longitude");
    const latitude = latitudeRaw ? parseFloat(latitudeRaw as string) : null;
    const longitude = longitudeRaw ? parseFloat(longitudeRaw as string) : null;

    const categories = JSON.parse(
      (formData.get("categories") as string) || "[]"
    );
    const deletedImages = JSON.parse(
      (formData.get("deletedImages") as string) || "[]"
    );
    const imageFiles = (formData.getAll("images") as File[]).filter(
      (f) => f && f.size > 0
    );

    // console.log("📝 New Post Values:");
    // console.log({ title, description, location, latitude, longitude });
    // console.log("🏷️ Categories:", categories);
    // console.log("🗑️ Deleted Images:", deletedImages);
    // console.log("📤 New Images Files:", imageFiles.length);

    if (deletedImages.length > 0) {
      // console.log("🚮 Deleting images...");

      await Promise.all(
        deletedImages.map(async (url: string) => {
          const publicId = extractPublicId(url);
          if (publicId) {
            await cloudinary.v2.uploader.destroy(publicId);
          } else {
            // console.log("⚠️ Could not extract publicId from:", url);
          }
        })
      );

      post.images = post.images.filter(
        (img: string) => !deletedImages.includes(img)
      );
      // console.log("🧹 Cleaned post.images:", post.images);
    }

    const uploadedUrls: string[] = [];

    if (imageFiles.length > 0) {
      // console.log("📤 Uploading new images to Cloudinary...");

      const urls = await Promise.all(
        imageFiles.map(async (file) => {
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const result = await cloudinary.v2.uploader.upload(
            `data:${file.type};base64,${base64}`,
            {
              folder: "news_post",
              transformation: [
                { width: 500, height: 500, crop: "limit" },
                { quality: "auto", fetch_format: "auto" },
              ],
            }
          );

          // console.log("✅ Uploaded:", result.secure_url);
          return result.secure_url;
        })
      );

      uploadedUrls.push(...urls);
    }

    post.images.push(...uploadedUrls);
    // console.log("🖼️ Final image list:", post.images);

    // console.log("📦 Updating post in DB...");
    post.title = title;
    post.description = description;
    post.location = location;
    post.latitude = latitude;
    post.longitude = longitude;
    post.categories = categories;

    await post.save();
    // console.log("✅ Post updated successfully:", post._id);

    return NextResponse.json(
      { message: "Post updated", post },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

function extractPublicId(imageUrl: string): string | null {
  const match = imageUrl.match(/\/news_post\/([^/.]+)\./);
  return match ? `news_post/${match[1]}` : null;
}
