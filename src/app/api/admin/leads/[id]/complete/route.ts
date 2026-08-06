import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getLead, markLeadCompleted } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const session = await requireStaff(["doctor"]);
  if (!session) {
    return NextResponse.json({ error: "Doctor access required" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const lead = await getLead(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const treatmentDone = String(body.treatmentDone || "").trim();
  const notes = String(body.notes || "").trim();
  const nextVisitDate = body.nextVisitDate ? String(body.nextVisitDate).trim() : undefined;

  await markLeadCompleted(id, lead.phone, { treatmentDone, notes, nextVisitDate });
  return NextResponse.json({ ok: true });
}
