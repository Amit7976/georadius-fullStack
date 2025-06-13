import { cookies } from "next/headers";

import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { UserProfile } from "@/src/models/UserProfileModel";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "user_interest";
const TEN_YEARS_IN_SECONDS = 10 * 365 * 24 * 60 * 60;

export async function GET() {
  console.log("====================================");
  console.log("======= Get User Interests ========");
  console.log("====================================");

  try {
    console.log("[1] Connecting to DB...");
    await connectToDatabase();

    console.log("[2] Authenticating user...");
    const session = await auth();
    const userId = session?.user?.id;
    console.log("[2.1] userId:", userId);

    if (!userId) {
      console.log("[2.2] No user ID found. Sending 401.");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    console.log("[3] Checking cookie for interest...");
    const cookieStore = await cookies();
    const interestCookie = cookieStore.get(COOKIE_NAME);
    
    if (interestCookie?.value) {
      console.log("[3.1] Cookie found! Returning interests from cookie.");
      return NextResponse.json({ interest: JSON.parse(interestCookie.value) });
    }

    console.log("[4] Cookie not found. Fetching from DB...");
    const userProfile = await UserProfile.findOne(
      { userId },
      { interest: 1, _id: 0 }
    );
    console.log("[4.1] DB result:", userProfile);

    if (!userProfile) {
      console.log("[4.2] No user profile found. Sending 404.");
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    console.log("[5] Setting interest in cookie for 10 years...");
    const res = NextResponse.json(userProfile);
    res.cookies.set(COOKIE_NAME, JSON.stringify(userProfile.interest), {
      httpOnly: true,
      path: "/",
      maxAge: TEN_YEARS_IN_SECONDS,
      sameSite: "lax",
    });

    console.log("[6] Returning interest from DB + cookie set ✅");
    return res;
  } catch (error) {
    console.error("❌ Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  console.log("====================================");
  console.log("======= Update User Interests ======");
  console.log("====================================");

  try {
    console.log("[1] Connecting to DB...");
    await connectToDatabase();

    console.log("[2] Authenticating user...");
    const session = await auth();
    const userId = session?.user?.id;
    console.log("[2.1] userId:", userId);

    if (!userId) {
      console.log("[2.2] No user ID found. Sending 400.");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("[3] Parsing request body...");
    const { interests } = await req.json();
    console.log("[3.1] Incoming interests:", interests);

    if (!Array.isArray(interests) || interests.length < 3) {
      console.log("[3.2] Invalid interest data.");
      return NextResponse.json(
        { error: "At least 3 interests required" },
        { status: 400 }
      );
    }

    console.log("[4] Fetching current interest from cookie...");
    const cookieStore = await cookies();
    const currentCookie = cookieStore.get(COOKIE_NAME)?.value;
    
    const currentInterests = currentCookie ? JSON.parse(currentCookie) : [];
    console.log("[4.1] Current interests from cookie:", currentInterests);

    const areSame =
      JSON.stringify([...currentInterests].sort()) ===
      JSON.stringify([...interests].sort());

    if (areSame) {
      console.log("[5] No changes in interests. Skipping DB update.");
      return NextResponse.json({ success: true, message: "No changes made" });
    }

    console.log("[6] Updating interests in DB...");
    await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { interest: interests } },
      { upsert: true }
    );
    console.log("[6.1] DB update complete ✅");

    console.log("[7] Updating cookie for 10 years...");
    const res = NextResponse.json({
      success: true,
      message: "Interests updated",
    });
    res.cookies.set(COOKIE_NAME, JSON.stringify(interests), {
      httpOnly: true,
      path: "/",
      maxAge: TEN_YEARS_IN_SECONDS,
      sameSite: "lax",
    });

    console.log("[8] Returning success with updated cookie ✅");
    return res;
  } catch (error) {
    console.error("❌ Error in PUT handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
