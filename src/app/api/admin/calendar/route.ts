import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getCalendarSlots } from "@/lib/db";
import { generateDaySlots } from "@/lib/slots";
import { todayIst } from "@/lib/time";

export async function GET(request: Request) {
  const session = await requireStaff("view_calendar");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || todayIst();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const { leads, blocked } = await getCalendarSlots(date);
  const allTimes = generateDaySlots();

  const bookedMap = new Map(leads.map((l) => [l.slotTime, l]));
  const blockedSet = new Set(blocked.map((b) => b.time));
  const blockedReasonMap = new Map(blocked.map((b) => [b.time, b.reason]));

  const slots = allTimes.map((time) => {
    if (bookedMap.has(time)) {
      const l = bookedMap.get(time)!;
      return { time, state: "booked" as const, lead: l };
    }
    if (blockedSet.has(time)) {
      return { time, state: "blocked" as const, reason: blockedReasonMap.get(time) || "" };
    }
    return { time, state: "free" as const };
  });

  return NextResponse.json({ date, slots, user: { role: session.role } });
}
