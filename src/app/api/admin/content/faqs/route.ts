/**
 * GET  /api/admin/content/faqs   — list all site FAQs
 * POST /api/admin/content/faqs   — create a new FAQ
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const faqs = await prisma.siteFaq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { question, answer, sortOrder } = body;
  if (!question || !answer) return NextResponse.json({ error: "question and answer required" }, { status: 400 });

  // Seed action — bulk insert default FAQs
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

  const faq = await prisma.siteFaq.create({
    data: {
      question,
      answer,
      sortOrder: sortOrder ?? 0,
      isActive: true,
    },
  });
  return NextResponse.json({ ok: true, faq });
}
