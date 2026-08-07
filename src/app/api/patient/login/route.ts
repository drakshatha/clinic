import { NextRequest, NextResponse } from "next/server";
import { consumeVerifiedOtp } from "@/lib/otp";
import { createPatientSession } from "@/lib/db";
import { normalizePhone } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { phone: phoneRaw, name } = await req.json().catch(() => ({}));
  const phone = normalizePhone(String(phoneRaw || ""));
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const consumed = await consumeVerifiedOtp(phone);
  if (!consumed) {
    return NextResponse.json(
      { error: "OTP not verified. Please verify your OTP first." },
      { status: 401 }
    );
  }

  // Upsert patient record
  const patient = await prisma.patient.upsert({
    where: { phone },
    update: { lastSeen: new Date(), ...(name ? { name } : {}) },
    create: { phone, name: name || "" },
  });

  // Create session (30 days)
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await createPatientSession(token, phone, expiresAt);

  const res = NextResponse.json({ ok: true, patient: { phone: patient.phone, name: patient.name } });
  res.cookies.set("akshatha_patient_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
  return res;
}
