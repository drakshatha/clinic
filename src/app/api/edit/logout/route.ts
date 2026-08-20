import { NextResponse } from "next/server";
import { EDITOR_COOKIE } from "@/lib/edit-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(EDITOR_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
