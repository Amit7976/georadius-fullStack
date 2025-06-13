import { Post } from "@/src/models/postModel";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Report } from "@/src/models/reportModel";
import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/utils";

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

export async function POST(req: Request) {
  // console.log("====================================");
  // console.log("============ Report API ============");
  // console.log("====================================");

  // console.log("📩 POST request received at /api/post/report")

  try {
    // console.log("🔗 Connecting to database...");
    await connectToDatabase();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // console.log("🐞 Report API called");

    const formData = await req.formData();
    const description = formData.get("description") as string;
    const postIdString = formData.get("postId") as string;
    const photos = formData.getAll("photos") as File[];

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!description || !postIdString) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const postId = new mongoose.Types.ObjectId(postIdString);

    // console.log("📩 Description:", description);
    // console.log("📝 Post ID:", postId);
    // console.log("🖼 Images received:", photos.length);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    let uploadedImageUrls: string[] = [];

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (photos.length > 0) {
      uploadedImageUrls = await Promise.all(
        photos.map(async (photo) => {
          const buffer = await photo.arrayBuffer();
          const base64Image = Buffer.from(buffer).toString("base64");

          const uploadResult = await cloudinary.v2.uploader.upload(
            `data:${photo.type};base64,${base64Image}`,
            {
              folder: "reports",
              transformation: [
                { width: 200, height: 200, crop: "limit" },
                { quality: "auto", fetch_format: "auto" },
              ],
            }
          );

          // console.log("Uploaded:", uploadResult.secure_url);
          return uploadResult.secure_url;
        })
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const newReport = new Report({
      postId,
      description,
      photos: uploadedImageUrls,
    });

    await newReport.save();
    // console.log("📝 Report saved:", newReport._id);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    await Post.findByIdAndUpdate(postId, {
      $push: { report: newReport._id.toString() },
    });
    // console.log("📌 Report ID pushed to Post");

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return NextResponse.json(
      {
        message: "Report submitted successfully",
        reportId: newReport._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Report API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
