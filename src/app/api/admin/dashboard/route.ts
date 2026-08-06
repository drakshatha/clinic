import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// IST = UTC+5:30
const IST_MS = 5.5 * 3600 * 1000;

function toIstDate(d: Date): string {
  return new Date(d.getTime() + IST_MS).toISOString().slice(0, 10);
}

function istDayStart(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00+05:30`);
}

function istDayEnd(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999+05:30`);
}

export async function GET(req: NextRequest) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const istToday = toIstDate(new Date());
  const from = searchParams.get("from") || istToday;
  const to   = searchParams.get("to")   || from;

  // ── 1. Leads whose appointment slot falls in this period ──────────────────
  const leads = await prisma.lead.findMany({
    where: { slotDate: { gte: from, lte: to } },
    select: {
      id: true, name: true, phone: true, treatment: true,
      slotDate: true, slotTime: true, status: true,
    },
  });

  // ── 2. Consultations *completed* in this period ───────────────────────────
  const consultations = await prisma.consultation.findMany({
    where: {
      completedAt: { gte: istDayStart(from), lte: istDayEnd(to) },
    },
    select: {
      visitType: true, paymentMode: true, paymentAmount: true, completedAt: true,
    },
  });

  // ── Lead counts ───────────────────────────────────────────────────────────
  const leadCounts = {
    total: 0, pending: 0, confirmed: 0, completed: 0,
    followup: 0, cancelled: 0, no_show: 0,
  } as Record<string, number>;

  for (const l of leads) {
    leadCounts.total++;
    if (l.status in leadCounts) leadCounts[l.status]++;
  }

  // ── Revenue ───────────────────────────────────────────────────────────────
  let collected = 0;
  const byMode:      Record<string, number> = {};
  const byModeCount: Record<string, number> = {};

  for (const c of consultations) {
    const amt  = c.paymentAmount  ?? 0;
    const mode = c.paymentMode    ?? "not_recorded";
    if (mode !== "waived" && mode !== "pending" && mode !== "not_recorded") {
      collected += amt;
    }
    byMode[mode]      = (byMode[mode]      || 0) + amt;
    byModeCount[mode] = (byModeCount[mode] || 0) + 1;
  }

  const pendingRevenue = byMode["pending"] ?? 0;

  // ── Visit type breakdown ──────────────────────────────────────────────────
  const byType: Record<string, number> = {};
  for (const c of consultations) {
    const t = c.visitType || "consultation";
    byType[t] = (byType[t] || 0) + 1;
  }

  // ── Revenue by IST day (for trend chart) ─────────────────────────────────
  const dayMap: Record<string, number> = {};
  for (const c of consultations) {
    const day = toIstDate(c.completedAt);
    dayMap[day] = (dayMap[day] || 0) + (c.paymentAmount ?? 0);
  }

  // Enumerate all days in range
  const revenueByDay: { date: string; amount: number }[] = [];
  const cursor = new Date(`${from}T00:00:00+05:30`);
  const end    = new Date(`${to}T23:59:59+05:30`);
  while (cursor <= end) {
    const day = toIstDate(cursor);
    revenueByDay.push({ date: day, amount: dayMap[day] ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  // ── Today's schedule list (only when from === to) ─────────────────────────
  const todaySchedule =
    from === to
      ? leads
          .filter((l) => l.status !== "cancelled")
          .sort((a, b) => a.slotTime.localeCompare(b.slotTime))
          .map((l) => ({
            id: l.id,
            name: l.name,
            phone: l.phone,
            treatment: l.treatment,
            slotTime: l.slotTime,
            status: l.status,
          }))
      : [];

  return NextResponse.json({
    period: { from, to },
    leads: leadCounts,
    revenue: { collected, pending: pendingRevenue, byMode, byModeCount },
    visits: { total: consultations.length, byType },
    revenueByDay,
    todaySchedule,
  });
}
