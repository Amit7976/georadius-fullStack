import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { UserProfile } from "@/src/models/UserProfileModel";

export async function POST(req: Request) {
  console.log("====================================");
  console.log("======= Fetch User Profile ========");
  console.log("====================================");

  console.log("🔹 Incoming request to fetch user profile...");

  try {
    const session = await auth();
    console.log("🔹 Session Data:", session);

    if (!session?.user?.id) {
      console.error("❌ No session or user ID found.");
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const { username } = await req.json();
    console.log("🔹 Username received:", username);

    if (!username) {
      console.error("❌ Username is missing in request.");
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    console.log(`🔹 Searching for user: ${username}...`);
    const userProfile = await UserProfile.findOne(
      { username },
      { fullname: 1, profileImage: 1, bio: 1, location: 1, userId: 1 }
    );

    if (!userProfile) {
      console.warn("⚠️ No user found in database.");
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    console.log("✅ User profile found:", userProfile);

    const currentUserProfile =
      userProfile.userId.toString() === session.user.id.toString();

    return NextResponse.json({
      fullname: userProfile.fullname,
      profileImage: userProfile.profileImage,
      bio: userProfile.bio,
      location: userProfile.location,
      currentUserProfile,
    });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("====================================");
  console.log("======= Get Current User ========");
  console.log("====================================");

  console.log("🔹 Incoming GET request to fetch current user...");

  try {
    console.log("[STEP 1] Authenticating user...");
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      console.error("[ERROR] User ID is missing!");
      return new NextResponse(null, { status: 204 });
    }

    console.log("[SUCCESS] User authenticated. User ID:", userId);

    console.log(`🔹 Fetching profile for current user with ID: ${userId}`);

    const userProfile = await UserProfile.findOne({ userId }, { username: 1 });

    if (!userProfile) {
      console.warn("⚠️ No user found in database.");
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    console.log("✅ Current user profile fetched:", userProfile);

    return NextResponse.json({ username: userProfile.username });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
