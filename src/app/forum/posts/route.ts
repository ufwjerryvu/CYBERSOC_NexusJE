import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    const whereClause = category ? { categories: category } : {};

    const posts = await db.post.findMany({
      where: whereClause,
      include: { user: true },
      orderBy: { creationDate: "desc" },
    });

    const mapped = posts.map((p) => ({
      id: p.id,
      title: p.title,
      tag: p.categories,
      username: p.user?.username ?? "unknown",
      isAdmin: p.user?.isAdmin ?? false,
      createdAt: p.creationDate,
    }));

    return NextResponse.json({ posts: mapped });
  } catch (err) {
    console.error("/forum/posts route error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
