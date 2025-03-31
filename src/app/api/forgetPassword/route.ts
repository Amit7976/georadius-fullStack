import { sendEmail } from "@/src/helpers/mailer";
import { connectToDatabase } from "@/src/lib/utils";
import { User } from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Connect to MongoDB database
connectToDatabase();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Validate the request
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Find the candidate by email
    const candidate = await User.findOne({ email });
    if (!candidate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Send verification email
    try {
      await sendEmail({
        email,
      });

      // Return success response if the email was sent successfully
      return NextResponse.json({
        message: "Password reset email sent successfully",
        success: true,
      });
    } catch (emailError: any) {
      // Return error response if there was an issue sending the email
      return NextResponse.json(
        {
          error: "Failed to send password reset email",
          details: emailError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    // Handle unexpected errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
