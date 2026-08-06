import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await requireStaff("manage_staff");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if ("isActive"    in body) data.isActive    = body.isActive;
  if ("badge"       in body) data.badge       = body.badge;
  if ("title"       in body) data.title       = body.title;
  if ("description" in body) data.description = body.description;
  if ("validUntil"  in body) data.validUntil  = body.validUntil || null;

  const offer = await prisma.offer.update({ where: { id }, data });
  return NextResponse.json({ offer });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await requireStaff("manage_staff");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.offer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
