import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint — no auth required, returns only active, non-expired offers
export async function GET() {
  const today = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      OR: [{ validUntil: null }, { validUntil: { gte: today } }],
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, badge: true, title: true, description: true, imageUrl: true, validUntil: true },
  });

  return NextResponse.json({ offers }, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
