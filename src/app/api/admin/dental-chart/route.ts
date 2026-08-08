/**
 * GET  /api/admin/dental-chart?phone=xxx  — fetch dental chart for a patient
 * PUT  /api/admin/dental-chart            — save teeth JSON { phone, teeth }
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  const chart = await prisma.dentalChart.findUnique({ where: { patientPhone: phone } });
  const teeth = chart ? JSON.parse(chart.teeth) : {};
  return NextResponse.json({ teeth, updatedAt: chart?.updatedAt ?? null });
}

export async function PUT(req: NextRequest) {
  const session = await requireStaff("complete_visits");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone, teeth } = await req.json();
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  const chart = await prisma.dentalChart.upsert({
    where: { patientPhone: phone },
    update: { teeth: JSON.stringify(teeth ?? {}) },
    create: { patientPhone: phone, teeth: JSON.stringify(teeth ?? {}) },
  });

  return NextResponse.json({ ok: true, updatedAt: chart.updatedAt });
}
