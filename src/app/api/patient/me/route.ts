import { NextRequest, NextResponse } from "next/server";
import { getPatientSession, getPatientByPhone } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("akshatha_patient_session")?.value;
  if (!token) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const session = await getPatientSession(token);
  if (!session || new Date(session.expiresAt) < new Date()) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  const patient = await getPatientByPhone(session.phone);
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  // Shape leads for the portal
  const appointments = patient.leads.map((l) => ({
    id: l.id,
    slotDate: l.slotDate,
    slotTime: l.slotTime,
    treatment: l.treatment,
    status: l.status,
    message: l.message,
  }));

  const history = patient.consultations.map((c) => ({
    id: c.id,
    visitType: c.visitType,
    treatmentDone: c.treatmentDone,
    notes: c.notes,
    nextVisitDate: c.nextVisitDate,
    completedAt: c.completedAt,
    paymentMode: c.paymentMode,
    paymentAmount: c.paymentAmount,
  }));

  return NextResponse.json({
    patient: { phone: patient.phone, name: patient.name, email: patient.email },
    appointments,
    history,
  });
}
