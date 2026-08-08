/**
 * GET /api/admin/analytics
 * Revenue & appointment analytics dashboard data
 */
import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // All consultations with payment
  const consultations = await prisma.consultation.findMany({
    select: { paymentAmount: true, paymentMode: true, treatmentDone: true, completedAt: true, patientPhone: true },
  });

  // All leads
  const leads = await prisma.lead.findMany({
    select: { status: true, slotDate: true, treatment: true, createdAt: true, patientPhone: true },
  });

  // All patients
  const patients = await prisma.patient.findMany({
    select: { joinedAt: true, phone: true },
  });

  // ── Monthly revenue (last 12 months) ──────────────────────────────────────
  const now = new Date();
  const months: { label: string; revenue: number; visits: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    const y = d.getFullYear();
    const m = d.getMonth();

    const monthConsu = consultations.filter((c) => {
      const cd = new Date(c.completedAt);
      return cd.getFullYear() === y && cd.getMonth() === m;
    });
    months.push({
      label,
      revenue: monthConsu.reduce((s, c) => s + (c.paymentAmount || 0), 0),
      visits:  monthConsu.length,
    });
  }

  // ── Treatment breakdown ───────────────────────────────────────────────────
  const treatMap: Record<string, { count: number; revenue: number }> = {};
  for (const c of consultations) {
    const t = c.treatmentDone?.trim() || "General";
    if (!treatMap[t]) treatMap[t] = { count: 0, revenue: 0 };
    treatMap[t].count++;
    treatMap[t].revenue += c.paymentAmount || 0;
  }
  const treatments = Object.entries(treatMap)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // ── Payment mode breakdown ────────────────────────────────────────────────
  const modeMap: Record<string, number> = {};
  for (const c of consultations) {
    const m = c.paymentMode || "unknown";
    modeMap[m] = (modeMap[m] || 0) + (c.paymentAmount || 0);
  }
  const paymentModes = Object.entries(modeMap)
    .map(([mode, amount]) => ({ mode, amount }))
    .sort((a, b) => b.amount - a.amount);

  // ── Lead status breakdown ─────────────────────────────────────────────────
  const statusMap: Record<string, number> = {};
  for (const l of leads) {
    statusMap[l.status] = (statusMap[l.status] || 0) + 1;
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalRevenue   = consultations.reduce((s, c) => s + (c.paymentAmount || 0), 0);
  const totalVisits    = consultations.length;
  const totalPatients  = patients.length;
  const avgRevenue     = totalVisits ? totalRevenue / totalVisits : 0;

  // This month
  const thisMonth = consultations.filter((c) => {
    const cd = new Date(c.completedAt);
    return cd.getFullYear() === now.getFullYear() && cd.getMonth() === now.getMonth();
  });
  const thisMonthRevenue = thisMonth.reduce((s, c) => s + (c.paymentAmount || 0), 0);
  const thisMonthVisits  = thisMonth.length;

  // New patients this month
  const newPatientsThisMonth = patients.filter((p) => {
    const jd = new Date(p.joinedAt);
    return jd.getFullYear() === now.getFullYear() && jd.getMonth() === now.getMonth();
  }).length;

  return NextResponse.json({
    months,
    treatments,
    paymentModes,
    statusBreakdown: statusMap,
    totals: {
      revenue: totalRevenue,
      visits:  totalVisits,
      patients: totalPatients,
      avgRevenue,
      thisMonthRevenue,
      thisMonthVisits,
      newPatientsThisMonth,
    },
  });
}
