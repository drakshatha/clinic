import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getOutstandingPayments } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await getOutstandingPayments();
  return NextResponse.json({ items });
}

/** PATCH — record payment for a consultation */
export async function PATCH(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { consultationId, paymentMode, paymentAmount, transactionId } = body;
  if (!consultationId || !paymentMode) {
    return NextResponse.json({ error: "consultationId and paymentMode required" }, { status: 400 });
  }

  const updated = await prisma.consultation.update({
    where: { id: consultationId },
    data: {
      paymentMode,
      paymentAmount: paymentAmount ? Number(paymentAmount) : null,
      transactionId: transactionId ?? null,
    },
  });
  return NextResponse.json(updated);
}
