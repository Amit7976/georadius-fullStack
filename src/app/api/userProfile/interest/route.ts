import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/utils";
import { UserProfile } from "@/src/models/UserProfileModel";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {

  console.log("====================================");
  console.log("======= Get User Interests ========");
  console.log("====================================");

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

   
    const userProfile = await UserProfile.findOne(
      { userId },
      { interest: 1, _id: 0 }
    );

    console.log("====================================");
    console.log(userProfile);
    console.log("====================================");

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userProfile);

  } catch (error) {

    console.error("Error fetching user interests:", error);
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

   const session = await auth();
   const userId = session?.user?.id;

   if (!userId) {
     return NextResponse.json(
       { error: "User ID is required" },
       { status: 400 }
     );
   }

  try {

    await connectToDatabase();

    const { interests } = await req.json();


    console.log("====================================");
    console.log(userId);
    console.log("====================================");
    console.log(interests);
    console.log("====================================");


    if (!userId || !Array.isArray(interests) || interests.length < 3) {
      console.log("====================================");
      console.log("Invalid Data");
      console.log("====================================");
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }


    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { interest: interests } },
      { upsert: true }
    );

    console.log("====================================");
    console.log("updatedProfile: " + updatedProfile);
    console.log("====================================");


    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("Error updating user interests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );

  }
}
