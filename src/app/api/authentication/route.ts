import { auth } from "@/src/auth";
import { NextResponse } from "next/server";

/////////////////////////////////////////////////////////////////////////////////////////////////////

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({ user: session?.user || null });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate" + error },
      { status: 500 }
    );
  }
}
