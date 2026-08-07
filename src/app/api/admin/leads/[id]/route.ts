import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { updateLead } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await requireStaff("confirm_leads");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));

  // ── Status-only update (existing flow) ──
  if ("status" in body && Object.keys(body).length === 1) {
    const status = String(body.status || "");
    const allowed = ["pending", "confirmed", "completed", "cancelled", "no_show"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const updated = await updateLead(id, { status });
    if (!updated) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ ok: true, lead: updated });
  }

  // ── Field edit update ──
  const patch: Record<string, unknown> = {};
  if (body.status    !== undefined) patch.status    = body.status;
  if (body.name      !== undefined) patch.name      = String(body.name).trim();
  if (body.email     !== undefined) patch.email     = String(body.email).trim();
  if (body.treatment !== undefined) patch.treatment = String(body.treatment).trim();
  if (body.message   !== undefined) patch.message   = String(body.message).trim();
  if (body.slot_date !== undefined) patch.slot_date = String(body.slot_date).trim();
  if (body.slot_time !== undefined) patch.slot_time = String(body.slot_time).trim();

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updated = await updateLead(id, patch);
  if (!updated) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead: updated });
}
