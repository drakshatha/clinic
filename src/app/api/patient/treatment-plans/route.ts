/** GET /api/patient/treatment-plans — returns treatment plans shared with this patient */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPatientSession, getTreatmentPlans } from "@/lib/db";

async function getPatient() {
  const jar = await cookies();
  const token = jar.get("akshatha_patient_session")?.value;
  if (!token) return null;
  const s = await getPatientSession(token);
  if (!s || new Date(s.expiresAt) < new Date()) return null;
  return s.patient;
}

export async function GET() {
  const patient = await getPatient();
  if (!patient) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  // Only return shared/accepted plans
  const plans = await getTreatmentPlans(patient.phone);
  const visible = plans.filter((p) => p.status === "shared" || p.status === "accepted");
  return NextResponse.json(visible);
}
