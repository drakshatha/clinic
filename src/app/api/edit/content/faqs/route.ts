import { NextRequest, NextResponse } from "next/server";
import { isSiteEditor } from "@/lib/edit-auth";
import { prisma } from "@/lib/prisma";

async function guard() {
  if (!(await isSiteEditor()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const err = await guard(); if (err) return err;
  const faqs = await prisma.siteFaq.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const body = await req.json();
  const { question, answer, sortOrder } = body;

  if (body.action === "seed" && Array.isArray(body.items)) {
    await prisma.siteFaq.deleteMany({});
    const created = await prisma.siteFaq.createMany({
      data: body.items.map((item: { question: string; answer: string }, i: number) => ({
        question: item.question,
        answer: item.answer,
        sortOrder: i,
        isActive: true,
      })),
    });
    return NextResponse.json({ ok: true, count: created.count });
  }

  if (!question || !answer)
    return NextResponse.json({ error: "question and answer required" }, { status: 400 });

  const faq = await prisma.siteFaq.create({
    data: { question, answer, sortOrder: sortOrder ?? 0, isActive: true },
  });
  return NextResponse.json({ ok: true, faq });
}
