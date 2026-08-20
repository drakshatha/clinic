import { NextRequest, NextResponse } from "next/server";
import { isSiteEditor } from "@/lib/edit-auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ slug: string }> };

async function guard() {
  if (!(await isSiteEditor()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const err = await guard(); if (err) return err;
  const { slug } = await ctx.params;
  const row = await prisma.serviceContent.findUnique({ where: { slug } });
  return NextResponse.json({ content: row });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const err = await guard(); if (err) return err;
  const { slug } = await ctx.params;
  const body = await req.json();
  const data = {
    title: body.title ?? "",
    shortTitle: body.shortTitle ?? "",
    summary: body.summary ?? "",
    description: body.description ?? "",
    benefits: JSON.stringify(Array.isArray(body.benefits) ? body.benefits : []),
    steps: JSON.stringify(Array.isArray(body.steps) ? body.steps : []),
    faqs: JSON.stringify(Array.isArray(body.faqs) ? body.faqs : []),
    startingFrom: body.startingFrom ?? "",
    keywords: JSON.stringify(Array.isArray(body.keywords) ? body.keywords : []),
  };
  const content = await prisma.serviceContent.upsert({
    where: { slug },
    create: { slug, ...data },
    update: data,
  });
  return NextResponse.json({ ok: true, content });
}
