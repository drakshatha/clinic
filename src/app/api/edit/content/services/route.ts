import { NextResponse } from "next/server";
import { isSiteEditor } from "@/lib/edit-auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SERVICE_CONTENT } from "@/lib/content-defaults";

async function guard() {
  if (!(await isSiteEditor()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const err = await guard(); if (err) return err;
  const rows = await prisma.serviceContent.findMany({ orderBy: { slug: "asc" } });
  return NextResponse.json({ services: rows });
}

export async function POST() {
  const err = await guard(); if (err) return err;
  const results = await Promise.all(
    DEFAULT_SERVICE_CONTENT.map((s) =>
      prisma.serviceContent.upsert({
        where: { slug: s.slug },
        create: {
          slug: s.slug, title: s.title, shortTitle: s.shortTitle,
          summary: s.summary, description: s.description,
          benefits: JSON.stringify(s.benefits), steps: JSON.stringify(s.steps),
          faqs: JSON.stringify(s.faqs), startingFrom: s.startingFrom,
          keywords: JSON.stringify(s.keywords),
        },
        update: {
          title: s.title, shortTitle: s.shortTitle, summary: s.summary,
          description: s.description, benefits: JSON.stringify(s.benefits),
          steps: JSON.stringify(s.steps), faqs: JSON.stringify(s.faqs),
          startingFrom: s.startingFrom, keywords: JSON.stringify(s.keywords),
        },
      })
    )
  );
  return NextResponse.json({ ok: true, count: results.length });
}
