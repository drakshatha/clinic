/** GET /api/patient/treatment-plans — returns treatment plans shared with this patient */
import { NextRequest, NextResponse } from "next/server";
import { getPatientSession, getTreatmentPlans } from "@/lib/db";

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return req.cookies.get("akshatha_patient_session")?.value ?? null;
}

async function getPatient(req: NextRequest) {
  const token = getToken(req);
  if (!token) return null;
  const s = await getPatientSession(token);
  if (!s || new Date(s.expiresAt) < new Date()) return null;
  return s.patient;
}

export async function GET(req: NextRequest) {
  const patient = await getPatient(req);
  if (!patient) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  // Only return shared/accepted plans
  const plans = await getTreatmentPlans(patient.phone);
  const visible = plans.filter((p) => p.status === "shared" || p.status === "accepted");
  return NextResponse.json(visible);
}
