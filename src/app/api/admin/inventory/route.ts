/**
 * GET  /api/admin/inventory         — list all items
 * POST /api/admin/inventory         — create item
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.inventoryItem.findMany({
    orderBy: { category: "asc" },
    include: {
      logs: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, category, unit, currentStock, minStock, costPerUnit, notes } = await req.json();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const item = await prisma.inventoryItem.create({
    data: {
      name,
      category: category || "general",
      unit: unit || "pcs",
      currentStock: currentStock ?? 0,
      minStock: minStock ?? 5,
      costPerUnit: costPerUnit ?? 0,
      notes: notes || "",
    },
  });

  return NextResponse.json({ ok: true, item });
}
