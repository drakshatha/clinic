import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { updateLead } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await requireStaff(["doctor", "assistant"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const status = String(body.status || "");
  const allowed = ["pending", "confirmed", "completed", "cancelled", "no_show"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await updateLead(id, {
    status: status as "pending" | "confirmed" | "completed" | "cancelled" | "no_show",
  });
  if (!updated) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, lead: updated });
}
