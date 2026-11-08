import { NextRequest, NextResponse } from "next/server";
import { getPatientSession, getMedicalHistory, upsertMedicalHistory } from "@/lib/db";
import { prisma } from "@/lib/prisma";

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

  const history = await getMedicalHistory(patient.phone);
  return NextResponse.json({ history, dob: patient.dob });
}

export async function PUT(req: NextRequest) {
  const patient = await getPatient(req);
  if (!patient) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const {
    bloodGroup,
    allergies,
    currentMedications,
    medicalConditions,
    smokingStatus,
    isPregnant,
    dentalConcerns,
    emergencyContactName,
    emergencyContactPhone,
    dob,
  } = body as Record<string, string>;

  const history = await upsertMedicalHistory(patient.phone, {
    bloodGroup: bloodGroup ?? "",
    allergies: allergies ?? "",
    currentMedications: currentMedications ?? "",
    medicalConditions: medicalConditions ?? "",
    smokingStatus: smokingStatus ?? "",
    isPregnant: isPregnant ?? "",
    dentalConcerns: dentalConcerns ?? "",
    emergencyContactName: emergencyContactName ?? "",
    emergencyContactPhone: emergencyContactPhone ?? "",
  });

  // Save DOB on patient record if provided
  if (dob !== undefined) {
    await prisma.patient.update({
      where: { phone: patient.phone },
      data: { dob: dob || null },
    });
  }

  return NextResponse.json({ ok: true, history });
}
