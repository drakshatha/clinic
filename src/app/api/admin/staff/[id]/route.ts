import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { updateStaff, deleteStaff } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await requireStaff(["doctor"]);
  if (!session) return NextResponse.json({ error: "Doctor access required" }, { status: 403 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));

  const patch: { name?: string; role?: string; password?: string } = {};
  if (body.name) patch.name = String(body.name).trim();
  if (body.role && ["doctor", "assistant"].includes(body.role)) patch.role = body.role;
  if (body.password && String(body.password).length >= 6) patch.password = String(body.password);

  try {
    const staff = await updateStaff(id, patch);
    return NextResponse.json({ ok: true, staff: { id: staff.id, name: staff.name, username: staff.username, role: staff.role } });
  } catch {
    return NextResponse.json({ error: "Staff not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await requireStaff(["doctor"]);
  if (!session) return NextResponse.json({ error: "Doctor access required" }, { status: 403 });

  const { id } = await ctx.params;

  // Prevent doctor from deleting themselves
  if (id === session.userId) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  try {
    await deleteStaff(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Staff not found" }, { status: 404 });
  }
}
