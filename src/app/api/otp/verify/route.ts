import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = String(body.phone || "").trim();
    const code = String(body.code || "").trim();
    if (!phone || !code) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }
    const result = await verifyOtp(phone, code);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, verified: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 400 }
    );
  }
}
