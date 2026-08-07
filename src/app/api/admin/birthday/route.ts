/**
 * GET  /api/admin/birthday          — preview today's birthday patients
 * POST /api/admin/birthday          — cron: send birthday WhatsApps (CRON_SECRET)
 * POST /api/admin/birthday?manual   — staff manual trigger
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getPatientsWithBirthdayToday } from "@/lib/db";
import { sendWhatsAppText, normalizePhone, birthdayMessage } from "@/lib/whatsapp";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patients = await getPatientsWithBirthdayToday();
  return NextResponse.json({ count: patients.length, patients });
}

export async function POST(req: NextRequest) {
  const isManual = req.nextUrl.searchParams.has("manual");

  if (isManual) {
    const session = await requireStaff();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } else {
    const secret = process.env.CRON_SECRET;
    const auth = req.headers.get("authorization") ?? "";
    if (!secret || auth !== `Bearer ${secret}`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patients = await getPatientsWithBirthdayToday();
  const results: Array<{ name: string; phone: string; sent: boolean }> = [];

  for (const p of patients) {
    const msg = birthdayMessage(p.name);
    const wa = await sendWhatsAppText(normalizePhone(p.phone), msg);
    results.push({ name: p.name, phone: p.phone, sent: wa.sent });
  }

  return NextResponse.json({ ok: true, sent: results.length, results });
}
