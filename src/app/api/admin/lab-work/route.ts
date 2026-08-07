/**
 * GET    /api/admin/lab-work          — list all lab work
 * POST   /api/admin/lab-work          — create new entry
 * PUT    /api/admin/lab-work          — update entry (id in body)
 * DELETE /api/admin/lab-work?id=X    — delete
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getAllLabWork, createLabWork, updateLabWork, deleteLabWork } from "@/lib/db";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const work = await getAllLabWork();
  return NextResponse.json(work);
}

export async function POST(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.leadId || !body.patientPhone || !body.labName || !body.sentDate) {
    return NextResponse.json({ error: "leadId, patientPhone, labName, sentDate required" }, { status: 400 });
  }

  const item = await createLabWork({
    leadId: body.leadId,
    patientPhone: body.patientPhone,
    patientName: body.patientName ?? "",
    labName: body.labName,
    workType: body.workType ?? "other",
    description: body.description ?? "",
    sentDate: body.sentDate,
    expectedDate: body.expectedDate,
    notes: body.notes,
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const item = await updateLabWork(body.id, {
    status: body.status,
    receivedDate: body.receivedDate,
    expectedDate: body.expectedDate,
    notes: body.notes,
  });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteLabWork(id);
  return NextResponse.json({ ok: true });
}
