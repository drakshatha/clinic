import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const offers = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ offers });
}

export async function POST(req: NextRequest) {
  const session = await requireStaff("manage_staff");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { badge, title, description, imageUrl, validUntil } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const offer = await prisma.offer.create({
    data: {
      badge:       badge?.trim()       || "OFFER",
      title:       title.trim(),
      description: description?.trim() || "",
      imageUrl:    imageUrl?.trim()    || null,
      validUntil:  validUntil || null,
    },
  });
  return NextResponse.json({ offer }, { status: 201 });
}
