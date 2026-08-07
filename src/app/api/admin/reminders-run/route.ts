/**
 * POST /api/admin/reminders-run
 * Requires manage_staff permission. Triggers reminder sending immediately
 * (same logic as the cron, but authorized via staff session).
 */
import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getLeadsNeedingReminders, markReminderSent } from "@/lib/db";
import { sendWhatsAppText, normalizePhone, reminder24hMessage, reminder1hMessage } from "@/lib/whatsapp";

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

export async function POST() {
  const session = await requireStaff("manage_staff");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = Date.now();
  const leads = await getLeadsNeedingReminders();
  const results: Array<{ leadId: string; name: string; type: string; sent: boolean }> = [];

  for (const lead of leads) {
    const slotMs = parseSlotUtcMs(lead.slotDate, lead.slotTime);
    const diffMs = slotMs - now;
    const diffH = diffMs / 3_600_000;

    if (!lead.reminder24hSent && diffH >= 22 && diffH <= 26) {
      const wa = await sendWhatsAppText(normalizePhone(lead.phone), reminder24hMessage(lead));
      await markReminderSent(lead.id, "24h");
      results.push({ leadId: lead.id, name: lead.name, type: "24h", sent: wa.sent });
    }
    if (!lead.reminder1hSent && diffMs >= 0 && diffH <= 1.25) {
      const wa = await sendWhatsAppText(normalizePhone(lead.phone), reminder1hMessage(lead));
      await markReminderSent(lead.id, "1h");
      results.push({ leadId: lead.id, name: lead.name, type: "1h", sent: wa.sent });
    }
  }

  return NextResponse.json({ ok: true, reminders: results });
}
