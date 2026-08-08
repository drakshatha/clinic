/**
 * GET  /api/admin/patient-images?phone=xxx  — list images for patient
 * POST /api/admin/patient-images            — upload image (base64)
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  const images = await prisma.patientImage.findMany({
    where: { patientPhone: phone },
    orderBy: { createdAt: "desc" },
    select: { id: true, label: true, imageData: true, createdAt: true },
  });

  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const session = await requireStaff("complete_visits");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone, label, imageData } = await req.json();
  if (!phone || !imageData) return NextResponse.json({ error: "phone and imageData required" }, { status: 400 });

  // Guard: max ~4MB base64
  if (imageData.length > 5_500_000) {
    return NextResponse.json({ error: "Image too large (max ~4MB)" }, { status: 400 });
  }

  // Ensure patient exists
  await prisma.patient.upsert({
    where: { phone },
    update: {},
    create: { phone, name: "" },
  });

  const img = await prisma.patientImage.create({
    data: { patientPhone: phone, label: label || "", imageData, uploadedById: session.userId },
  });

  return NextResponse.json({ ok: true, id: img.id });
}
