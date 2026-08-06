import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { blockSlot, unblockSlot } from "@/lib/db";

export async function POST(request: Request) {
  const session = await requireStaff(["doctor"]);
  if (!session) return NextResponse.json({ error: "Doctor access required" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const date = String(body.date || "").trim();
  const time = String(body.time || "").trim();
  const reason = String(body.reason || "").trim();

  if (!date || !time) {
    return NextResponse.json({ error: "date and time required" }, { status: 400 });
  }

  await blockSlot(date, time, reason);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await requireStaff(["doctor"]);
  if (!session) return NextResponse.json({ error: "Doctor access required" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const date = String(body.date || "").trim();
  const time = String(body.time || "").trim();

  if (!date || !time) {
    return NextResponse.json({ error: "date and time required" }, { status: 400 });
  }

  await unblockSlot(date, time);
  return NextResponse.json({ ok: true });
}
