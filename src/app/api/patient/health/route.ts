import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPatientSession, getMedicalHistory, upsertMedicalHistory } from "@/lib/db";
import { prisma } from "@/lib/prisma";

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

  const history = await getMedicalHistory(patient.phone);
  return NextResponse.json({ history, dob: patient.dob });
}

export async function PUT(req: NextRequest) {
  const patient = await getPatient();
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
