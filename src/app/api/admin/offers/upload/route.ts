import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";

// POST /api/admin/offers/upload — upload offer image to Vercel Blob
export async function POST(request: Request) {
  const session = await requireStaff("manage_staff");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image storage not configured. Set BLOB_READ_WRITE_TOKEN in Vercel." },
      { status: 503 }
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large (max 5 MB)" }, { status: 413 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  const { put } = await import("@vercel/blob");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await put(`clinic/offers/${Date.now()}_${safeName}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
