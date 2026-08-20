import { NextRequest, NextResponse } from "next/server";
import { verifyEditorPassword, EDITOR_COOKIE } from "@/lib/edit-auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const token = verifyEditorPassword(password);
  if (!token) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(EDITOR_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
