import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getAllLeads, createLead } from "@/lib/db";
import { formatIstDateTime, formatSlotLabel } from "@/lib/time";
import { normalizePhone } from "@/lib/whatsapp";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await getAllLeads();
  const enriched = leads.map((l) => ({
    ...l,
    created_at_ist: formatIstDateTime(l.created_at),
    slot_label: formatSlotLabel(l.slot_date, l.slot_time),
    confirmed_at_ist: l.confirmed_at ? formatIstDateTime(l.confirmed_at) : null,
  }));

  return NextResponse.json({
    user: { name: session.name, role: session.role, permissions: session.permissions },
    leads: enriched,
  });
}

// POST — admin/assistant manually add an appointment (no OTP needed)
export async function POST(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name       = String(body.name || "").trim();
  const phone      = String(body.phone || "").trim();
  const email      = String(body.email || "").trim();
  const treatment  = String(body.treatment || "").trim();
  const message    = String(body.message || "").trim();
  const slot_date  = String(body.slot_date || "").trim();
  const slot_time  = String(body.slot_time || "").trim();
  const status     = body.status === "pending" ? "pending" : "confirmed";

  if (!name || !phone || !slot_date || !slot_time) {
    return NextResponse.json({ error: "Name, phone, date and time are required" }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 10) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const lead = await createLead({
    name,
    phone: normalizedPhone,
    email,
    treatment,
    message,
    slot_date,
    slot_time,
    source: "admin",
    status,
  });

  // Auto-confirm if status is confirmed
  if (status === "confirmed") {
    const { prisma } = await import("@/lib/prisma");
    await prisma.lead.update({
      where: { id: lead.id },
      data: { confirmedById: session.userId, confirmedAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true, lead }, { status: 201 });
}
