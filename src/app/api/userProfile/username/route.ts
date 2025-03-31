import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { UserProfile } from "@/src/models/UserProfileModel";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("====================================");
    console.log("User authenticated:", userId);
    console.log("====================================");

    const userProfile = await UserProfile.findOne(
      { userId },
      { username: 1, _id: 0 }
    );

    console.log("====================================");
    console.log("User Profile:", userProfile);
    console.log("====================================");

    const isUsernameEmpty = !userProfile || !userProfile.username;

    return NextResponse.json({ isUsernameEmpty });
  } catch (error) {
    console.log("====================================");
    console.error("Error fetching user profile:", error);
    console.log("====================================");

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
