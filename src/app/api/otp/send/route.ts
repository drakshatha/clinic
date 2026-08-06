import { NextResponse } from "next/server";
import { sendOtp } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = String(body.phone || "").trim();
    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }
    const result = await sendOtp(phone);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send OTP" },
      { status: 400 }
    );
  }
}
