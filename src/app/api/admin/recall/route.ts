/**
 * GET  /api/admin/recall          — preview patients who'd receive a recall
 * POST /api/admin/recall          — cron: send recall WhatsApps (CRON_SECRET auth)
 * POST /api/admin/recall?manual   — staff-triggered manual run (session auth)
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getPatientsForRecall, markRecallSent } from "@/lib/db";
import { sendWhatsAppText, normalizePhone, recallMessage } from "@/lib/whatsapp";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patients = await getPatientsForRecall();
  return NextResponse.json({ count: patients.length, patients });
}

export async function POST(req: NextRequest) {
  const isManual = req.nextUrl.searchParams.has("manual");

  if (isManual) {
    const session = await requireStaff("manage_staff");
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else {
    // Cron auth
    const secret = process.env.CRON_SECRET;
    const auth = req.headers.get("authorization") ?? "";
    if (!secret || auth !== `Bearer ${secret}`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patients = await getPatientsForRecall();
  const results: Array<{ phone: string; name: string; sent: boolean }> = [];

  for (const p of patients) {
    const msg = recallMessage(p.name);
    const wa = await sendWhatsAppText(normalizePhone(p.phone), msg);
    await markRecallSent(p.phone);
    results.push({ phone: p.phone, name: p.name, sent: wa.sent });
  }

  return NextResponse.json({ ok: true, sent: results.length, results });
}
