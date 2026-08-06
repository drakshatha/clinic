import { NextResponse } from "next/server";
import { loginStaff } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const result = await loginStaff(username, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json(
      { error: "Server error — check Vercel logs" },
      { status: 500 }
    );
  }
}
