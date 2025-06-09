import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { connectToDatabase } from "@/src/lib/utils";
import { User } from "@/src/models/userModel";
import { auth } from "@/src/auth";

export async function POST(req: Request) {
  try {
    const {
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both fields are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email }).select(
      "+password +tempPassword"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isCurrentPasswordValid =
      (user.password && (await compare(currentPassword, user.password))) ||
      (user.tempPassword && currentPassword === user.tempPassword);

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    user.tempPassword = ""; // Clear temp password if it existed
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🔥 Error updating password:", error.message || error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
