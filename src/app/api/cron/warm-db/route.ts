/**
 * GET /api/cron/warm-db
 *
 * Keep-warm endpoint pinged by UptimeRobot every 5 minutes.
 * Sends a trivial SELECT 1 to Neon so the compute never auto-suspends,
 * eliminating cold-start latency on the admin panel.
 *
 * No auth required — SELECT 1 has zero side effects and cannot be abused.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    console.error("[warm-db] ping failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
