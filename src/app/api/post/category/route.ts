import { connectToDatabase } from "@/src/lib/utils";
import { Post } from "@/src/models/postModel";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {


  console.log("====================================");
  console.log("======== Post Category API ========");
  console.log("====================================");
  console.log("📌 [START] Category API");

  try {
    
    console.log("➡️ Connecting to DB...");
    await connectToDatabase();


    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const radius = parseInt(searchParams.get("radius") || "50");
    const latMin = parseFloat(searchParams.get("latMin") || "");
    const latMax = parseFloat(searchParams.get("latMax") || "");
    const lngMin = parseFloat(searchParams.get("lngMin") || "");
    const lngMax = parseFloat(searchParams.get("lngMax") || "");


    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }


    console.log("🔍 Category:", category);
    console.log("📍 Radius:", radius, "km");
    console.log(
      "🧭 Bounds => lat:",
      latMin,
      "-",
      latMax,
      "| lng:",
      lngMin,
      "-",
      lngMax
    );


    const query: any = {
      categories: { $in: [category] },
    };

   
    if (!isNaN(latMin) && !isNaN(latMax) && !isNaN(lngMin) && !isNaN(lngMax)) {
      query.latitude = { $gte: latMin, $lte: latMax };
      query.longitude = { $gte: lngMin, $lte: lngMax };
    }


    const posts = await Post.find(query)
      .sort({ updatedAt: -1 })
      .select(
        "_id title description images location latitude longitude updatedAt"
      );

    
    console.log(`✅ Found ${posts.length} posts`);


    return NextResponse.json(posts);
  } catch (err) {

    console.error("❌ Category API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
    
  }
}
