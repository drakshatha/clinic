/**
 * PATCH  /api/admin/content/faqs/[id]  — update question / answer / sortOrder / isActive
 * DELETE /api/admin/content/faqs/[id]  — remove FAQ
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
  const { question, answer, sortOrder, isActive } = body;

  const faq = await prisma.siteFaq.update({
    where: { id },
    data: {
      ...(question !== undefined && { question }),
      ...(answer !== undefined && { answer }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isActive !== undefined && { isActive }),
    },
  });
  return NextResponse.json({ ok: true, faq });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.siteFaq.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
