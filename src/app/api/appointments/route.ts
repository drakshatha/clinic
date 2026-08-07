import { NextResponse } from "next/server";
import { createLead, isSlotTaken } from "@/lib/db";
import { verifyOtp, consumeVerifiedOtp } from "@/lib/otp";
import { getSlotsForDate } from "@/lib/slots";
import { bookingLinks, normalizePhone } from "@/lib/whatsapp";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name      = String(body.name      || "").trim();
  const phone     = String(body.phone     || "").trim();
  const email     = String(body.email     || "").trim();
  const treatment = String(body.treatment || "").trim();
  const message   = String(body.message   || "").trim();
  const slot_date = String(body.slot_date || "").trim();
  const slot_time = String(body.slot_time || "").trim();
  const otp       = String(body.otp       || "").trim();
  const source    = String(body.source    || "website").trim();
  const dob       = String(body.dob    || "").trim() || undefined;
  const gender    = String(body.gender || "").trim() || undefined;

  if (!name || !phone || !slot_date || !slot_time) {
    return NextResponse.json(
      { error: "Name, phone, slot date and time are required" },
      { status: 400 }
    );
  }
  if (!otp) {
    return NextResponse.json({ error: "OTP is required to submit" }, { status: 400 });
  }

  const verified = await verifyOtp(phone, otp);
  if (!verified.ok) {
    return NextResponse.json({ error: verified.error }, { status: 400 });
  }
  await consumeVerifiedOtp(phone);

  try {
    const daySlots = await getSlotsForDate(slot_date);
    const match = daySlots.find((s) => s.time === slot_time);
    if (!match?.available || (await isSlotTaken(slot_date, slot_time))) {
      return NextResponse.json(
        {
          error: "That slot is no longer available. Please pick another time.",
          open: daySlots.filter((s) => s.available),
        },
        { status: 409 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid slot date" }, { status: 400 });
  }

  const lead = await createLead({
    name,
    phone: normalizePhone(phone).replace(/^91/, "+91 "),
    email,
    treatment,
    message,
    slot_date,
    slot_time,
    source,
    status: "pending",
    dob,
    gender,
  });

  const links = bookingLinks(lead);

  const webhook = process.env.APPOINTMENT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch {
      console.error("[appointments] webhook failed");
    }
  }

  return NextResponse.json({
    ok: true,
    lead,
    message: "Appointment requested. The clinic will confirm on WhatsApp shortly.",
    whatsappUrl: links.clinicInbox,
  });
}
