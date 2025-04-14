import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { UserProfile } from "@/src/models/UserProfileModel";


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function GET(req: Request) {

  console.log("====================================");
  console.log("======= Get User Profile ========");
  console.log("====================================");


  console.log("[START] Fetching user profile...");


  try {

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


  
    console.log("[STEP 2] Connecting to database...");
    await connectToDatabase();
    console.log("[SUCCESS] Database connected.");


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

  console.log("====================================");
  console.log("======= Update User Profile ========");
  console.log("====================================");

  
  console.log("[START] Processing profile update request...");

  
  try {
  
    console.log("🔗 Connecting to database...");
    await connectToDatabase();


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
    const profileImage = formData.get("profileImage");

    let profileImageUrl: string | undefined;
    let oldProfileImageUrl: string | undefined;


    const currentUserProfile = await UserProfile.findOne({ userId });

    if (currentUserProfile) {
      oldProfileImageUrl = currentUserProfile.profileImage;
    }

   
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
                { width: 300, height: 300, crop: "limit" },
                { quality: "auto", fetch_format: "auto" },
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

     
      if (oldProfileImageUrl) {
        try {
         
          const publicId = oldProfileImageUrl.split("/").pop()?.split(".")[0];
          if (publicId) {
            console.log(
              `[STEP 4] Deleting old image from Cloudinary: ${publicId}`
            );

            console.log("====================================");
            const folderPath = "profile_pictures";
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
      { new: true, upsert: true }
    );

    console.log("[SUCCESS] Profile updated successfully!");

    return NextResponse.json({
      message: "Profile updated successfully!",
      userProfile,
    });

  } catch (error) {

    console.error("[ERROR] Profile update failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );

  }
}
