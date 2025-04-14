import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { UserProfile } from "@/src/models/UserProfileModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  console.log("====================================");
  console.log("======= Checking User Profile ======");
  console.log("====================================");

  console.log("📌 [START] Checking User Profile Existence");

  try {
    
    await connectToDatabase();


    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

   
    const profileExists = await UserProfile.exists({ userId });

    console.log("====================================");
    console.log("Does user profile exist?", profileExists);
    console.log("====================================");

    return NextResponse.json({ exists: !!profileExists });

  } catch (error) {

    console.error("Error checking user profile existence:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    
  }
}
