import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getDashboardStats, toIstDate } from "@/lib/dashboard";

export async function GET(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const istToday = toIstDate(new Date());
  const from = searchParams.get("from") || istToday;
  const to   = searchParams.get("to")   || from;

  const data = await getDashboardStats(from, to);
  return NextResponse.json(data);
}
