/**
 * GET  /api/admin/consent-forms?phone=xxx  — list consent forms for patient
 * POST /api/admin/consent-forms            — create new consent form
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  const forms = await prisma.consentForm.findMany({
    where: { patientPhone: phone },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, signatureData: true, signedAt: true, createdAt: true },
  });

  return NextResponse.json({ forms });
}

export async function POST(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone, title, content } = await req.json();
  if (!phone || !title || !content) {
    return NextResponse.json({ error: "phone, title, content required" }, { status: 400 });
  }

  await prisma.patient.upsert({
    where: { phone },
    update: {},
    create: { phone, name: "" },
  });

  const form = await prisma.consentForm.create({
    data: { patientPhone: phone, title, content, createdById: session.userId },
  });

  return NextResponse.json({ ok: true, id: form.id });
}
