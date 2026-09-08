import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getPatientMedicalHistory } from "@/lib/db";

/** GET /api/admin/patients/medical-history?phone=... — lazy-load on patient expand */
export async function GET(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  const mh = await getPatientMedicalHistory(phone);
  return NextResponse.json({ medicalHistory: mh ?? null });
}
