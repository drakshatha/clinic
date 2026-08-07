/**
 * GET  /api/admin/treatment-plans?phone=XXXX  — list plans for a patient (or all)
 * POST /api/admin/treatment-plans              — create a new plan
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff, getSession } from "@/lib/auth";
import { getTreatmentPlans, createTreatmentPlan } from "@/lib/db";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await getTreatmentPlans();
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.patientPhone || !body.title || !Array.isArray(body.phases)) {
    return NextResponse.json({ error: "patientPhone, title, phases required" }, { status: 400 });
  }
  if (body.phases.length === 0) {
    return NextResponse.json({ error: "At least one phase required" }, { status: 400 });
  }

  const plan = await createTreatmentPlan({
    patientPhone: body.patientPhone,
    title: body.title,
    notes: body.notes ?? "",
    createdById: session.userId,
    phases: body.phases,
  });

  return NextResponse.json(plan, { status: 201 });
}
