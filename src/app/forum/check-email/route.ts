import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : null;

    if (!email) {
      return NextResponse.json({ error: "missing email" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });

    return NextResponse.json({ exists: !!user });
  } catch (err) {
    console.error("check-email route error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
