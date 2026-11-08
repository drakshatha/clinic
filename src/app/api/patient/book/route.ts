import { NextRequest, NextResponse } from "next/server";
import { getPatientSession } from "@/lib/db";
import { createLead } from "@/lib/db";

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return req.cookies.get("akshatha_patient_session")?.value ?? null;
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const session = await getPatientSession(token);
  if (!session || new Date(session.expiresAt) < new Date()) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const slot_date = String(body.date || "").trim();
  const slot_time = String(body.time || "").trim();
  const treatment = String(body.treatment || "").trim();

  if (!slot_date || !slot_time) {
    return NextResponse.json({ error: "Date and time are required" }, { status: 400 });
  }

  // Date must be today or future
  const today = new Date().toISOString().slice(0, 10);
  if (slot_date < today) {
    return NextResponse.json({ error: "Cannot book a past date" }, { status: 400 });
  }

  const { prisma } = await import("@/lib/prisma");
  const patient = await prisma.patient.findUnique({
    where: { phone: session.phone },
    select: { name: true, email: true, phone: true },
  });
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  const lead = await createLead({
    name: patient.name,
    phone: patient.phone,
    email: patient.email || "",
    treatment,
    slot_date,
    slot_time,
    source: "app",
    status: "pending",
  });

  return NextResponse.json({ ok: true, appointment: lead }, { status: 201 });
}
