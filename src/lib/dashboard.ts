/**
 * dashboard.ts — shared stats query used by both the API route (period changes)
 * and the server component (initial page load, no HTTP round-trip needed).
 */
import { prisma } from "@/lib/prisma";

const IST_MS = 5.5 * 3600 * 1000;

export function toIstDate(d: Date): string {
  return new Date(d.getTime() + IST_MS).toISOString().slice(0, 10);
}

export function istDayStart(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00+05:30`);
}

export function istDayEnd(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999+05:30`);
}

export async function getDashboardStats(from: string, to: string) {
  const [leads, consultations] = await Promise.all([
    prisma.lead.findMany({
      where: { slotDate: { gte: from, lte: to } },
      select: {
        id: true, name: true, phone: true, treatment: true,
        slotDate: true, slotTime: true, status: true,
      },
    }),
    prisma.consultation.findMany({
      where: { completedAt: { gte: istDayStart(from), lte: istDayEnd(to) } },
      select: { visitType: true, paymentMode: true, paymentAmount: true, completedAt: true },
    }),
  ]);

  // Lead counts
  const leadCounts = {
    total: 0, pending: 0, confirmed: 0, completed: 0,
    followup: 0, cancelled: 0, no_show: 0,
  } satisfies Record<string, number>;
  for (const l of leads) {
    leadCounts.total++;
    const key = l.status as keyof typeof leadCounts;
    if (key in leadCounts) leadCounts[key]++;
  }

  // Revenue
  let collected = 0;
  const byMode:      Record<string, number> = {};
  const byModeCount: Record<string, number> = {};
  for (const c of consultations) {
    const amt  = c.paymentAmount  ?? 0;
    const mode = c.paymentMode    ?? "not_recorded";
    if (mode !== "waived" && mode !== "pending" && mode !== "not_recorded") collected += amt;
    byMode[mode]      = (byMode[mode]      || 0) + amt;
    byModeCount[mode] = (byModeCount[mode] || 0) + 1;
  }
  const pendingRevenue = byMode["pending"] ?? 0;

  // Visit types
  const byType: Record<string, number> = {};
  for (const c of consultations) {
    const t = c.visitType || "consultation";
    byType[t] = (byType[t] || 0) + 1;
  }

  // Revenue by IST day
  const dayMap: Record<string, number> = {};
  for (const c of consultations) {
    const day = toIstDate(c.completedAt);
    dayMap[day] = (dayMap[day] || 0) + (c.paymentAmount ?? 0);
  }
  const revenueByDay: { date: string; amount: number }[] = [];
  const cursor = new Date(`${from}T00:00:00+05:30`);
  const end    = new Date(`${to}T23:59:59+05:30`);
  while (cursor <= end) {
    const day = toIstDate(cursor);
    revenueByDay.push({ date: day, amount: dayMap[day] ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  // Today's schedule
  const todaySchedule =
    from === to
      ? leads
          .filter((l) => l.status !== "cancelled")
          .sort((a, b) => a.slotTime.localeCompare(b.slotTime))
          .map(({ id, name, phone, treatment, slotTime, status }) => ({
            id, name, phone, treatment, slotTime, status,
          }))
      : [];

  return {
    period: { from, to },
    leads: leadCounts,
    revenue: { collected, pending: pendingRevenue, byMode, byModeCount },
    visits: { total: consultations.length, byType },
    revenueByDay,
    todaySchedule,
  };
}
