import { NextRequest, NextResponse } from "next/server";
import { isSiteEditor } from "@/lib/edit-auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

async function guard() {
  if (!(await isSiteEditor()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const err = await guard(); if (err) return err;
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
  const err = await guard(); if (err) return err;
  const { id } = await ctx.params;
  await prisma.siteFaq.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
