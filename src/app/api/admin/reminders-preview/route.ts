/**
 * GET /api/admin/reminders-preview
 * Requires staff session (view_leads). Shows confirmed leads with reminder status.
 */
import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getLeadsNeedingReminders } from "@/lib/db";
import { prisma } from "@/lib/prisma";

/** Parse slot into UTC ms (IST = UTC+5:30) */
function parseSlotUtcMs(slotDate: string, slotTime: string): number {
  const upper = slotTime.toUpperCase().trim();
  const ampm = upper.endsWith("AM") ? "AM" : "PM";
  const [hStr, mStr] = upper.replace(/[AP]M/, "").trim().split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  const midnightUtcMs = new Date(`${slotDate}T00:00:00.000Z`).getTime();
  return midnightUtcMs + h * 3_600_000 + m * 60_000 - 5.5 * 3_600_000;
}

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get all confirmed leads (including those already sent reminders, for display)
  const leads = await prisma.lead.findMany({
    where: { status: "confirmed" },
    select: {
      id: true, name: true, phone: true, treatment: true,
      slotDate: true, slotTime: true,
      reminder24hSent: true, reminder1hSent: true,
    },
    orderBy: [{ slotDate: "asc" }, { slotTime: "asc" }],
  });

  const now = Date.now();
  const result = leads.map((l) => {
    const slotMs = parseSlotUtcMs(l.slotDate, l.slotTime);
    const diffH = (slotMs - now) / 3_600_000;
    return { ...l, diffH: Math.round(diffH * 10) / 10 };
  });

  return NextResponse.json({ leads: result });
}
