import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { updateStaff, deleteStaff, getAllStaff } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await requireStaff("manage_staff");
  if (!session) return NextResponse.json({ error: "Permission denied" }, { status: 403 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));

  const patch: { name?: string; role?: string; password?: string; permissions?: string } = {};
  if (body.name) patch.name = String(body.name).trim();
  if (body.role) patch.role = String(body.role).trim();
  if (body.password && String(body.password).length >= 6) patch.password = String(body.password);
  if (Array.isArray(body.permissions)) patch.permissions = JSON.stringify(body.permissions);

  try {
    const staff = await updateStaff(id, patch);
    return NextResponse.json({ ok: true, staff: { id: staff.id, name: staff.name, username: staff.username, role: staff.role } });
  } catch {
    return NextResponse.json({ error: "Staff not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await requireStaff("manage_staff");
  if (!session) return NextResponse.json({ error: "Permission denied" }, { status: 403 });

  const { id } = await ctx.params;

  // Check if target is owner — owners cannot be deleted
  const allStaff = await getAllStaff();
  const target = allStaff.find((s) => s.id === id);
  if (!target) return NextResponse.json({ error: "Staff not found" }, { status: 404 });
  if (target.isOwner) return NextResponse.json({ error: "Cannot remove the owner account" }, { status: 400 });
  if (id === session.userId) return NextResponse.json({ error: "Cannot remove your own account" }, { status: 400 });

  try {
    await deleteStaff(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove staff" }, { status: 500 });
  }
}
