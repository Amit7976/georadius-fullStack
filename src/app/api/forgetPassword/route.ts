import { sendEmail } from "@/src/helpers/mailer";
import { connectToDatabase } from "@/src/lib/utils";
import { User } from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { Error } from "mongoose";

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
      await sendEmail({ email });

      return NextResponse.json({
        message: "Password reset email sent successfully",
        success: true,
      });
    } catch (emailError: unknown) {
      if (emailError instanceof Error) {
        return NextResponse.json(
          {
            error: "Failed to send password reset email",
            details: emailError.message,
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          error: "Failed to send password reset email",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
