import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getLead, markLeadCompleted, type VisitType, type PaymentMode } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

const VALID_VISIT_TYPES: VisitType[] = ["consultation", "treatment", "followup", "resolved"];
const VALID_PAYMENT_MODES: PaymentMode[] = ["cash", "upi", "card", "online", "waived", "pending"];

export async function POST(request: Request, ctx: Ctx) {
  const session = await requireStaff("complete_visits");
  if (!session) {
    return NextResponse.json({ error: "Doctor access required" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const lead = await getLead(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));

  const visitType: VisitType = VALID_VISIT_TYPES.includes(body.visitType)
    ? body.visitType
    : "consultation";
  const treatmentDone = String(body.treatmentDone || "").trim();
  const notes = String(body.notes || "").trim();
  const nextVisitDate = body.nextVisitDate ? String(body.nextVisitDate).trim() : undefined;
  const paymentMode: PaymentMode | undefined = VALID_PAYMENT_MODES.includes(body.paymentMode)
    ? body.paymentMode
    : undefined;
  const paymentAmount = body.paymentAmount ? Number(body.paymentAmount) : undefined;
  const transactionId = body.transactionId ? String(body.transactionId).trim() : undefined;

  await markLeadCompleted(id, lead.phone, {
    visitType,
    treatmentDone,
    notes,
    nextVisitDate,
    paymentMode,
    paymentAmount,
    transactionId,
  });

  return NextResponse.json({ ok: true });
}
