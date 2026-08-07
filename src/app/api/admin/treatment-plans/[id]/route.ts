/**
 * GET    /api/admin/treatment-plans/[id]
 * PUT    /api/admin/treatment-plans/[id]         — update plan + phases
 * DELETE /api/admin/treatment-plans/[id]
 * POST   /api/admin/treatment-plans/[id]?action=share         — WhatsApp share
 * POST   /api/admin/treatment-plans/[id]?action=phase-complete — toggle phase done
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import {
  getTreatmentPlan,
  updateTreatmentPlan,
  deleteTreatmentPlan,
  markPhaseCompleted,
} from "@/lib/db";
import { sendWhatsAppText, normalizePhone, treatmentPlanMessage } from "@/lib/whatsapp";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const plan = await getTreatmentPlan(id);
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const plan = await updateTreatmentPlan(id, body);
  return NextResponse.json(plan);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteTreatmentPlan(id);
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const action = req.nextUrl.searchParams.get("action");

  if (action === "share") {
    const plan = await getTreatmentPlan(id);
    if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const msg = treatmentPlanMessage(
      plan.patient.name,
      plan.title,
      plan.phases.map((p) => ({
        phaseNumber: p.phaseNumber,
        title: p.title,
        estimatedCost: p.estimatedCost,
        duration: p.duration,
      })),
      plan.totalCost,
      plan.notes
    );

    const wa = await sendWhatsAppText(normalizePhone(plan.patient.phone), msg);
    await updateTreatmentPlan(id, { status: "shared", sharedAt: new Date() });
    return NextResponse.json({ ok: true, sent: wa.sent });
  }

  if (action === "phase-complete") {
    const body = await req.json();
    if (!body.phaseId) return NextResponse.json({ error: "phaseId required" }, { status: 400 });
    const phase = await markPhaseCompleted(body.phaseId, body.isCompleted ?? true);
    return NextResponse.json(phase);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
