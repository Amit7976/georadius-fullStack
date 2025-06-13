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


export async function POST(req: Request) {

  // console.log("====================================");
  // console.log("======= Update User Profile ========");
  // console.log("====================================");
  

  // console.log("[START] Processing profile update request...");

  try {
   
    // console.log("[STEP 1] Authenticating user...");

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      console.error("[ERROR] User ID is missing!");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // console.log("[SUCCESS] User authenticated. User ID:", userId);


    // console.log("[STEP 2] Parsing form data...");

    const formData = await req.formData();
    const username = formData.get("username")?.toString() || "";
    const fullName = formData.get("fullName")?.toString() || "";
    const phoneNumber = formData.get("phoneNumber")?.toString() || "";
    const dob = formData.get("dob")
      ? new Date(formData.get("dob")!.toString())
      : null;
    const location = formData.get("location")?.toString() || "";
    const bio = formData.get("bio")?.toString() || "";
    const interest = formData.getAll("interest").map(String) || [];

    // console.log("[SUCCESS] Form data parsed successfully.");

    let profileImageUrl = "";

   
    const file = formData.get("profileImage") as File | null;

    if (file) {

      // console.log("[STEP 3] Uploading profile image to Cloudinary...");

      try {

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
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
                  // console.log("[SUCCESS] Image uploaded successfully.");
                  resolve(result);
                }
              }
            )
            .end(buffer);
        });

        
         const typedUploadResult = uploadResult as { secure_url: string };
         profileImageUrl = typedUploadResult.secure_url || "";

      } catch (uploadError) {

        console.error("[ERROR] Image upload exception:", uploadError);

      }

    } else {

      // console.log("[INFO] No profile image provided, skipping upload.");

    }


    // console.log("[STEP 4] Connecting to database...");
    await connectToDatabase();
    // console.log("[SUCCESS] Database connected successfully.");


    // console.log("[STEP 5] Checking if user profile exists...");
    let userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {

      // console.log("[INFO] User profile does not exist, creating new profile...");

      userProfile = await UserProfile.create({
        userId,
        username,
        fullname: fullName,
        phoneNumber,
        dob,
        location,
        bio,
        interest: interest.length > 0 ? interest : [],
        posts: [],
        profileImage: profileImageUrl,
      });

      // console.log("[SUCCESS] New profile created.");

    } else {

      // console.log("[INFO] User profile found, updating existing profile...");

      userProfile.username = username;
      userProfile.fullname = fullName;
      userProfile.phoneNumber = phoneNumber;
      userProfile.dob = dob;
      userProfile.location = location;
      userProfile.bio = bio;
      userProfile.interest = interest.length > 0 ? interest : [];
      if (profileImageUrl) userProfile.profileImage = profileImageUrl;
      await userProfile.save();

      // console.log("[SUCCESS] User profile updated successfully.");

    }


    // console.log("[END] Profile update request completed successfully.");

    return NextResponse.json({
      message: "Profile updated successfully!",
      userProfile,
    });

  } catch (error) {

    console.error("[FATAL ERROR] Error updating profile:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );

  }
}
