import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { createDocument, getLeadDocuments, getLead, deleteDocument } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/admin/leads/[id]/documents — list documents for a lead
export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const docs = await getLeadDocuments(id);
  return NextResponse.json({ documents: docs });
}

// POST /api/admin/leads/[id]/documents — upload a document via Vercel Blob
export async function POST(request: Request, ctx: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check Vercel Blob is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error: "Document storage not configured. Set BLOB_READ_WRITE_TOKEN in Vercel environment variables.",
        setup_needed: true,
      },
      { status: 503 }
    );
  }

  const { id } = await ctx.params;
  const lead = await getLead(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  const docType = String(formData.get("docType") || "other");

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Max 20MB
  const MAX_BYTES = 20 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 20 MB)" }, { status: 413 });
  }

  // Dynamically import @vercel/blob (only available when configured)
  const { put } = await import("@vercel/blob");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blobPath = `clinic/leads/${id}/${Date.now()}_${safeName}`;

  const blob = await put(blobPath, file, {
    access: "public",
    contentType: file.type || "application/octet-stream",
  });

  const doc = await createDocument({
    leadId: id,
    patientPhone: lead.phone,
    fileName: file.name,
    fileUrl: blob.url,
    fileSize: file.size,
    mimeType: file.type,
    docType,
    uploadedById: session.userId,
  });

  return NextResponse.json({ document: doc });
}

// DELETE /api/admin/leads/[id]/documents?docId=xxx
export async function DELETE(request: Request, ctx: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const docId = url.searchParams.get("docId");
  if (!docId) return NextResponse.json({ error: "docId required" }, { status: 400 });

  await deleteDocument(docId);
  return NextResponse.json({ ok: true });
}
