/**
 * PATCH  /api/admin/inventory/[id]   — update stock or item details
 *   body: { change: number, note: string }  → adjust stock + create log
 *   body: { name, category, unit, minStock, costPerUnit, notes }  → update item meta
 * DELETE /api/admin/inventory/[id]   — delete item
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();

  if ("change" in body) {
    // Stock adjustment
    const { change, note } = body;
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { currentStock: { increment: change }, updatedAt: new Date() },
    });
    await prisma.inventoryLog.create({
      data: { itemId: id, change, note: note || "", staffId: session.userId },
    });
    return NextResponse.json({ ok: true, currentStock: item.currentStock });
  } else {
    // Meta update
    const { name, category, unit, minStock, costPerUnit, notes } = body;
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { name, category, unit, minStock, costPerUnit, notes, updatedAt: new Date() },
    });
    return NextResponse.json({ ok: true, item });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.inventoryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
