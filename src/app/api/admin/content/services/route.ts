/**
 * GET  /api/admin/content/services       — list all service content rows
 * POST /api/admin/content/services/seed  — seed default content for all services
 */
import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SERVICE_CONTENT } from "@/lib/content-defaults";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.serviceContent.findMany({ orderBy: { slug: "asc" } });
  return NextResponse.json({ services: rows });
}

/** POST with body { action: "seed" } to upsert all default content */
export async function POST() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results = await Promise.all(
    DEFAULT_SERVICE_CONTENT.map((s) =>
      prisma.serviceContent.upsert({
        where: { slug: s.slug },
        create: {
          slug: s.slug,
          title: s.title,
          shortTitle: s.shortTitle,
          summary: s.summary,
          description: s.description,
          benefits: JSON.stringify(s.benefits),
          steps: JSON.stringify(s.steps),
          faqs: JSON.stringify(s.faqs),
          startingFrom: s.startingFrom,
          keywords: JSON.stringify(s.keywords),
        },
        update: {
          title: s.title,
          shortTitle: s.shortTitle,
          summary: s.summary,
          description: s.description,
          benefits: JSON.stringify(s.benefits),
          steps: JSON.stringify(s.steps),
          faqs: JSON.stringify(s.faqs),
          startingFrom: s.startingFrom,
          keywords: JSON.stringify(s.keywords),
        },
      })
    )
  );
  return NextResponse.json({ ok: true, count: results.length });
}
