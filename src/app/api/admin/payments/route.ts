import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getOutstandingPayments } from "@/lib/db";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await getOutstandingPayments();
  return NextResponse.json({ items });
}
