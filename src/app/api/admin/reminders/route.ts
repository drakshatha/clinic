/**
 * POST /api/admin/reminders
 *
 * Called by GitHub Actions cron every hour.
 * Auth: Authorization: Bearer <CRON_SECRET>
 *
 * Checks confirmed leads and sends WhatsApp reminders:
 *   - 24h reminder: slot is 22–26h from now, reminder24hSent = false
 *   - 1h reminder:  slot is 0–75min from now, reminder1hSent = false
 *
 * Falls back to creating a wa.me link (no-op if WhatsApp API not configured).
 */
import { NextRequest, NextResponse } from "next/server";
import { getLeadsNeedingReminders, markReminderSent } from "@/lib/db";
import { sendWhatsAppText, normalizePhone, reminder24hMessage, reminder1hMessage } from "@/lib/whatsapp";

/** Parse a slot like "5:30 PM" on date "2026-08-07" into a UTC Date (IST = UTC+5:30). */
function parseSlotUtc(slotDate: string, slotTime: string): Date {
  const upper = slotTime.toUpperCase().trim();
  const ampm = upper.endsWith("AM") ? "AM" : "PM";
  const [hStr, mStr] = upper.replace(/[AP]M/, "").trim().split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;

  // Build as IST: date at midnight UTC + h*3600 + m*60 - 5.5h IST offset
  const midnightUtcMs = new Date(`${slotDate}T00:00:00.000Z`).getTime();
  const slotUtcMs = midnightUtcMs + h * 3600_000 + m * 60_000 - 5.5 * 3600_000;
  return new Date(slotUtcMs);
}

export async function POST(req: NextRequest) {
  // Auth check
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const leads = await getLeadsNeedingReminders();

  const results: Array<{
    leadId: string;
    name: string;
    type: "24h" | "1h";
    sent: boolean;
    channel?: string;
  }> = [];

  for (const lead of leads) {
    const slotMs = parseSlotUtc(lead.slotDate, lead.slotTime).getTime();
    const diffMs = slotMs - now;
    const diffH = diffMs / 3_600_000;

    // 24h window: between 22h and 26h before slot
    if (!lead.reminder24hSent && diffH >= 22 && diffH <= 26) {
      const msg = reminder24hMessage(lead);
      const phone = normalizePhone(lead.phone);
      const wa = await sendWhatsAppText(phone, msg);
      await markReminderSent(lead.id, "24h");
      results.push({ leadId: lead.id, name: lead.name, type: "24h", sent: wa.sent, channel: wa.sent ? "whatsapp_api" : "queued" });
    }

    // 1h window: between 0 and 75 minutes before slot
    if (!lead.reminder1hSent && diffMs >= 0 && diffH <= 1.25) {
      const msg = reminder1hMessage(lead);
      const phone = normalizePhone(lead.phone);
      const wa = await sendWhatsAppText(phone, msg);
      await markReminderSent(lead.id, "1h");
      results.push({ leadId: lead.id, name: lead.name, type: "1h", sent: wa.sent, channel: wa.sent ? "whatsapp_api" : "queued" });
    }
  }

  console.log(`[reminders] processed ${leads.length} leads, sent ${results.length} reminders`);
  return NextResponse.json({ ok: true, processed: leads.length, reminders: results });
}

/** GET for health-check / manual trigger preview */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await getLeadsNeedingReminders();
  const now = Date.now();
  const preview = leads.map((l) => {
    const slotMs = parseSlotUtc(l.slotDate, l.slotTime).getTime();
    const diffH = (slotMs - now) / 3_600_000;
    return { id: l.id, name: l.name, slotDate: l.slotDate, slotTime: l.slotTime, diffH: Math.round(diffH * 10) / 10, reminder24hSent: l.reminder24hSent, reminder1hSent: l.reminder1hSent };
  });
  return NextResponse.json({ leads: preview });
}
