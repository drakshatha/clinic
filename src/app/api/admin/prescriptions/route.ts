/**
 * GET  /api/admin/prescriptions?phone=xxx  — list prescriptions for a patient
 * POST /api/admin/prescriptions            — create a new prescription
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  const rxList = await prisma.prescription.findMany({
    where: { patientPhone: phone },
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });

  return NextResponse.json({
    prescriptions: rxList.map((rx) => ({
      id: rx.id,
      patientName: rx.patientName,
      chiefComplaint: rx.chiefComplaint,
      diagnosis: rx.diagnosis,
      medications: JSON.parse(rx.medications),
      advice: rx.advice,
      createdBy: rx.createdBy.name,
      createdAt: rx.createdAt,
      leadId: rx.leadId,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await requireStaff("complete_visits");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { patientPhone, patientName, leadId, chiefComplaint, diagnosis, medications, advice } = body;

  if (!patientPhone) return NextResponse.json({ error: "patientPhone required" }, { status: 400 });
  if (!medications?.length) return NextResponse.json({ error: "At least one medication required" }, { status: 400 });

  const rx = await prisma.prescription.create({
    data: {
      patientPhone,
      patientName: patientName ?? "",
      leadId: leadId ?? null,
      chiefComplaint: chiefComplaint ?? "",
      diagnosis: diagnosis ?? "",
      medications: JSON.stringify(medications),
      advice: advice ?? "",
      createdById: session.userId,
    },
  });

  return NextResponse.json({ ok: true, id: rx.id });
}
