import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getAllPatients } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await requireStaff("view_leads");
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ?slim=true — only name + phone, used by dropdowns (TreatmentPlanManager etc.)
    if (req.nextUrl.searchParams.get("slim") === "true") {
      const rows = await prisma.patient.findMany({
        select: { phone: true, name: true },
        orderBy: { lastSeen: "desc" },
      });
      return NextResponse.json({ patients: rows });
    }

    const patients = await getAllPatients();
    return NextResponse.json({ patients });
  } catch (err) {
    console.error("[/api/admin/patients GET]", err);
    return NextResponse.json(
      { error: "Failed to load patients", detail: String(err) },
      { status: 500 }
    );
  }
}

/** PATCH — update patient DOB or notes */
export async function PATCH(req: NextRequest) {
  const session = await requireStaff("confirm_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  const data: { dob?: string | null } = {};
  if ("dob" in body) data.dob = body.dob || null;

  const patient = await prisma.patient.update({ where: { phone: body.phone }, data });
  return NextResponse.json(patient);
}
