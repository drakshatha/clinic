import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getLead, updateLead } from "@/lib/db";
import { bookingLinks, sendWhatsAppText } from "@/lib/whatsapp";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const session = await requireStaff("confirm_leads");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const lead = await getLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  if (lead.status === "cancelled") {
    return NextResponse.json({ error: "Lead is cancelled" }, { status: 400 });
  }

  const links = bookingLinks(lead);
  const apiSend = await sendWhatsAppText(lead.phone, links.confirmText);

  const updated = await updateLead(id, {
    status: "confirmed",
    confirmed_by: session.userId,          // FK → StaffUser.id
    confirmed_at: new Date().toISOString(),
    whatsapp_confirm_sent: apiSend.sent,
  });

  return NextResponse.json({
    ok: true,
    lead: updated,
    whatsapp: {
      patientConfirmUrl: links.patientConfirm,
      apiSend,
      mode: apiSend.sent ? "api" : "wa_me_link",
    },
    message: apiSend.sent
      ? "Confirmed and WhatsApp sent to patient."
      : "Confirmed. Open WhatsApp link to message the patient (API not configured).",
  });
}
