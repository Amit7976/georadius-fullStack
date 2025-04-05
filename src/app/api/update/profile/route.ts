import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { UserProfile } from "@/src/models/UserProfileModel";

// Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// **GET: Fetch User Profile**
export async function GET(req: Request) {
  console.log("[START] Fetching user profile...");

  try {
    // Authenticate User
    console.log("[STEP 1] Authenticating user...");
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      console.error("[ERROR] User ID is missing!");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    console.log("[SUCCESS] User authenticated. User ID:", userId);

    // Connect to Database
    console.log("[STEP 2] Connecting to database...");
    await connectToDatabase();
    console.log("[SUCCESS] Database connected.");

    // Fetch user profile
    console.log("[STEP 3] Fetching user profile from DB...");
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      console.error("[ERROR] User profile not found.");
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    console.log("[SUCCESS] User profile fetched.");
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("[FATAL ERROR] Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  console.log("[START] Processing profile update request...");

  try {
    // Authenticate User
    console.log("[STEP 1] Authenticating user...");
    const session = await auth();
    if (!session || !session.user?.id) {
      console.log("[ERROR] User authentication failed.");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const userId = session.user.id;
    console.log(`[SUCCESS] User authenticated: ${userId}`);

    // Parse Form Data
    console.log("[STEP 2] Parsing form data...");
    const formData = await req.formData();
    console.log(
      "[INFO] Received form data:",
      Object.fromEntries(formData.entries())
    );

    const username = formData.get("username")?.toString() || "";
    const fullName = formData.get("fullName")?.toString() || "";
    const phoneNumber = formData.get("phoneNumber")?.toString() || "";
    const dob = formData.get("dob")
      ? new Date(formData.get("dob")!.toString())
      : null;
    const location = formData.get("location")?.toString() || "";
    const bio = formData.get("bio")?.toString() || "";
    const profileImage = formData.get("profileImage"); // Can be a File or a URL

    let profileImageUrl: string | undefined;
    let oldProfileImageUrl: string | undefined;

    // Fetch the current profile info to check the old image
    const currentUserProfile = await UserProfile.findOne({ userId });

    if (currentUserProfile) {
      oldProfileImageUrl = currentUserProfile.profileImage;
    }

    // Check if profileImage is a new File
    if (profileImage instanceof File) {
      console.log(
        "[STEP 3] New profile image detected. Uploading to Cloudinary..."
      );

      try {
        const arrayBuffer = await profileImage.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        profileImageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
              folder: "profile_pictures",
              transformation: [
                { width: 300, height: 300, crop: "limit" }, // Resize image
                { quality: "auto", fetch_format: "auto" }, // Compress and set format automatically
              ],
            },
            (error, result) => {
              if (error) {
                console.error("[ERROR] Cloudinary upload failed:", error);
                reject(error);
              } else {
                console.log("[SUCCESS] Image uploaded successfully:", result);
                resolve(result?.secure_url);
              }
            }
          );
          uploadStream.end(buffer);
        });
      } catch (uploadError) {
        console.error("[ERROR] Image upload exception:", uploadError);
      }

      // If there's an old image, delete it from Cloudinary
      if (oldProfileImageUrl) {
        try {
          // Extract public ID from the old image URL (Cloudinary URLs include the public ID)
          const publicId = oldProfileImageUrl.split("/").pop()?.split(".")[0];
          if (publicId) {
            console.log(
              `[STEP 4] Deleting old image from Cloudinary: ${publicId}`
            );

            console.log("====================================");
            const folderPath = "profile_pictures"; // Assuming the images are uploaded under this folder
            const publicIdWithFolder = `${folderPath}/${publicId}`;

            try {
              await cloudinary.v2.uploader.destroy(publicIdWithFolder);
              console.log("[SUCCESS] Old image deleted successfully.");
            } catch (deleteError) {
              console.error(
                "[ERROR] Failed to delete old image from Cloudinary:",
                deleteError
              );
            }

            console.log("====================================");
            console.log("[SUCCESS] Old image deleted successfully.");
          }
        } catch (deleteError) {
          console.error(
            "[ERROR] Failed to delete old image from Cloudinary:",
            deleteError
          );
        }
      }
    } else {
      profileImageUrl = profileImage || "";
      console.log(
        "[INFO] No new profile image uploaded. Keeping existing image."
      );
    }

    console.log("[STEP 5] Updating user profile in database...");
    console.log("[INFO] Updated profile image URL:", profileImageUrl);

    // Find and Update User Profile (or create if not found)
    let userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        username,
        fullname: fullName,
        phoneNumber,
        dob,
        location,
        bio,
        profileImage: profileImageUrl || "/images/profileIcon/image.jpg",
      },
      { new: true, upsert: true } // 'new' returns the updated document, 'upsert' creates if not found
    );

    console.log("[SUCCESS] Profile updated successfully!");

    return NextResponse.json({
      message: "Profile updated successfully!",
    });
  } catch (error) {
    console.error("[ERROR] Profile update failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
