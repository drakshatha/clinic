import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getAllPatients } from "@/lib/db";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patients = await getAllPatients();
  return NextResponse.json({ patients });
}
