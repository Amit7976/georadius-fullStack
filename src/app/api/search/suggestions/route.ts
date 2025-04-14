import { connectToDatabase } from "@/src/lib/utils";
import { Post } from "@/src/models/postModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  console.log("====================================");
  console.log("======== Search Suggestions ========");
  console.log("====================================");

  console.log("📌 [START] Search Suggestions API");


  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([], { status: 200 });
  }
  console.log("🔍 Searching for suggestions:", query);


  try {

    console.log("➡️ Connecting to DB...");
    await connectToDatabase();
    

    const results = await Post.find(
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
        ],
      },
      { _id: 1, title: 1 }
    )
      .limit(5)
      .lean();

    
    const suggestions = results.map((post: any) => ({
      id: post._id.toString(),
      name: post.title,
    }));

    
    return NextResponse.json(suggestions, { status: 200 });

  } catch (error) {

    console.error("MongoDB suggestion error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );

  }
}
