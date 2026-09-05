/**
 * GET /api/cron/warm-db
 *
 * Keep-warm endpoint called by Vercel Cron every 4 minutes.
 * Sends a trivial query to Neon so the compute never auto-suspends
 * during clinic hours (and stays ready overnight too).
 *
 * Protected by CRON_SECRET env var to prevent abuse.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");

  // Allow Vercel Cron (Bearer token) or internal curl with the secret
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Cheapest possible query — asks Neon for the current timestamp
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    console.error("[warm-db] ping failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
