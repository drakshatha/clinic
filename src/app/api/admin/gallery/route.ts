/**
 * GET    /api/admin/gallery     — list all cases
 * POST   /api/admin/gallery     — create a case
 * PUT    /api/admin/gallery     — update (id in body)
 * DELETE /api/admin/gallery?id  — delete
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getAllGallery, createGalleryCase, updateGalleryCase, deleteGalleryCase } from "@/lib/db";

export async function GET() {
  const session = await requireStaff();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cases = await getAllGallery();
  return NextResponse.json(cases);
}

export async function POST(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.beforeUrl || !body.afterUrl) {
    return NextResponse.json({ error: "title, beforeUrl, afterUrl required" }, { status: 400 });
  }

  const item = await createGalleryCase({
    title: body.title,
    treatment: body.treatment,
    beforeUrl: body.beforeUrl,
    afterUrl: body.afterUrl,
    description: body.description,
    isPublic: body.isPublic ?? true,
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const item = await updateGalleryCase(body.id, {
    title: body.title,
    treatment: body.treatment,
    description: body.description,
    isPublic: body.isPublic,
    sortOrder: body.sortOrder,
  });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteGalleryCase(id);
  return NextResponse.json({ ok: true });
}
