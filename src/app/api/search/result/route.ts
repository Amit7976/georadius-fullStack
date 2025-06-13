import { connectToDatabase } from "@/src/lib/utils";
import { Post } from "@/src/models/postModel";
import { UserProfile } from "@/src/models/UserProfileModel";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // disables caching

export async function GET(req: NextRequest) {
  // console.log("====================================");
  // console.log("========= Search API Route =========");
  // console.log("====================================");

  // console.log("📌 [START] Search API");

  try {
    // console.log("➡️ Connecting to DB...");
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const type = searchParams.get("type") || "post";
    // const radiusParam = searchParams.get("radius");
    // const radius = isNaN(parseInt(radiusParam ?? ""))
    //   ? 50
    //   : parseInt(radiusParam!);
    const latMin = parseFloat(searchParams.get("latMin") || "");
    const latMax = parseFloat(searchParams.get("latMax") || "");
    const lngMin = parseFloat(searchParams.get("lngMin") || "");
    const lngMax = parseFloat(searchParams.get("lngMax") || "");

    if (!query) {
      console.warn("⚠️ Empty query string. Returning empty results.");
      return NextResponse.json({ users: [], posts: [] });
    }

    if (query.length < 3) {
      console.warn("⚠️ Query string too short. Returning empty results.");
      return NextResponse.json({ users: [], posts: [] });
    }

    if (isNaN(latMin) || isNaN(latMax) || isNaN(lngMin) || isNaN(lngMax)) {
      return NextResponse.json(
        { error: "Invalid coordinates provided." },
        { status: 400 }
      );
    }

    const regex = new RegExp(query, "i");

    // console.log("🔍 Searching for query:", query);
    // console.log("📍 Radius:", radius);
    // console.log("🧭 Coordinates:", { latMin, latMax, lngMin, lngMax });

    if (type === "user") {
      const users = await UserProfile.find({
        $or: [{ username: regex }, { fullname: regex }, { location: regex }],
      }).select("username fullname profileImage");
      // console.log("✅ Users found:", users.length);
      return NextResponse.json({ users });
    } else {
      const posts = await Post.find({
        $and: [
          {
            $or: [
              { title: regex },
              { description: regex },
              { location: regex },
            ],
          },
          {
            latitude: { $gte: latMin, $lte: latMax },
            longitude: { $gte: lngMin, $lte: lngMax },
          },
        ],
      })
        .select(
          "_id title description images location latitude longitude updatedAt"
        )
        .sort({ updatedAt: -1 });

      // console.log("✅ Posts found:", posts.length);
      return NextResponse.json({ posts });
    }
  } catch (err) {
    console.error("❌ Search API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
