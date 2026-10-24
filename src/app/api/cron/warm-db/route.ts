// Warm-db disabled — keeping DB awake 24/7 exhausts the Neon free tier compute quota.
// Neon auto-suspends after 5 min of inactivity; cold-start latency is acceptable.
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, disabled: true });
}
