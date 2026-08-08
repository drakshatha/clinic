"use client";

import { useEffect, useState } from "react";

type MonthData  = { label: string; revenue: number; visits: number };
type Treatment  = { name: string; count: number; revenue: number };
type PayMode    = { mode: string; amount: number };
type Totals     = {
  revenue: number; visits: number; patients: number; avgRevenue: number;
  thisMonthRevenue: number; thisMonthVisits: number; newPatientsThisMonth: number;
};

const INR = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-white p-4 flex flex-col gap-1`}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

function BarChart({ months }: { months: MonthData[] }) {
  const maxRev = Math.max(...months.map((m) => m.revenue), 1);
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-bold text-navy mb-4">Monthly Revenue (last 12 months)</p>
      <div className="flex items-end gap-1.5 h-40">
        {months.map((m) => {
          const h = (m.revenue / maxRev) * 100;
          return (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10">
                <div className="rounded-lg bg-navy text-white text-[10px] px-2 py-1 whitespace-nowrap font-semibold shadow-lg">
                  {INR(m.revenue)}
                  <br />
                  <span className="font-normal opacity-80">{m.visits} visits</span>
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-navy" />
              </div>
              {/* Bar */}
              <div
                style={{ height: `${Math.max(h, m.revenue > 0 ? 4 : 0)}%` }}
                className={`w-full rounded-t-md transition-all ${
                  m.revenue > 0 ? "bg-blue hover:bg-blue-deep" : "bg-line"
                }`}
              />
              <span className="text-[8px] text-muted font-medium">{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MODE_LABELS: Record<string, string> = {
  cash: "💵 Cash", upi: "📱 UPI", card: "💳 Card",
  online: "🌐 Online", waived: "🆓 Waived", unknown: "❓ Unknown",
};

export function AnalyticsManager() {
  const [loading, setLoading] = useState(true);
  const [months, setMonths]   = useState<MonthData[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [paymentModes, setPaymentModes] = useState<PayMode[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<Record<string, number>>({});
  const [totals, setTotals] = useState<Totals | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => {
        setMonths(d.months);
        setTreatments(d.treatments);
        setPaymentModes(d.paymentModes);
        setStatusBreakdown(d.statusBreakdown);
        setTotals(d.totals);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map((i) => <div key={i} className="h-24 rounded-2xl bg-white border border-line" />)}
        </div>
        <div className="h-52 rounded-2xl bg-white border border-line" />
      </div>
    );
  }

  const maxTreat = Math.max(...treatments.map((t) => t.revenue), 1);
  const totalMode = paymentModes.reduce((s, m) => s + m.amount, 0) || 1;
  const totalStatus = Object.values(statusBreakdown).reduce((s, n) => s + n, 0) || 1;

  const STATUS_COLORS: Record<string, string> = {
    completed:  "bg-blue-100 text-blue-800",
    confirmed:  "bg-green-100 text-green-800",
    pending:    "bg-amber-100 text-amber-800",
    cancelled:  "bg-red-100 text-red-700",
    no_show:    "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Revenue" value={INR(totals!.revenue)} sub="All time" color="text-blue" />
        <StatCard label="This Month" value={INR(totals!.thisMonthRevenue)} sub={`${totals!.thisMonthVisits} visits`} color="text-green-700" />
        <StatCard label="Avg / Visit" value={INR(totals!.avgRevenue)} sub={`${totals!.visits} total visits`} color="text-navy" />
        <StatCard label="Patients" value={String(totals!.patients)} sub={`+${totals!.newPatientsThisMonth} this month`} color="text-purple-700" />
      </div>

      {/* Bar chart */}
      <BarChart months={months} />

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Treatment breakdown */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-bold text-navy mb-4">Top Treatments by Revenue</p>
          {treatments.length === 0 ? (
            <p className="text-xs text-muted italic">No completed consultations yet.</p>
          ) : (
            <div className="space-y-2.5">
              {treatments.map((t) => (
                <div key={t.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-navy font-medium truncate max-w-[65%]">{t.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-muted">{t.count}×</span>
                      <span className="text-xs font-bold text-navy">{INR(t.revenue)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-line overflow-hidden">
                    <div className="h-full rounded-full bg-blue" style={{ width: `${(t.revenue / maxTreat) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment modes + Status */}
        <div className="space-y-4">
          {/* Payment modes */}
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs font-bold text-navy mb-3">Payment Modes</p>
            {paymentModes.length === 0 ? (
              <p className="text-xs text-muted italic">No payments recorded.</p>
            ) : (
              <div className="space-y-2">
                {paymentModes.map((m) => (
                  <div key={m.mode} className="flex items-center gap-2">
                    <span className="text-xs w-28 text-navy">{MODE_LABELS[m.mode] ?? m.mode}</span>
                    <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                      <div className="h-full rounded-full bg-teal-500" style={{ width: `${(m.amount / totalMode) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-navy w-20 text-right">{INR(m.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointment status */}
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs font-bold text-navy mb-3">Appointment Status</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusBreakdown).map(([s, n]) => (
                <div key={s} className="flex flex-col items-center gap-0.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[s] ?? "bg-gray-100 text-gray-700"}`}>
                    {n}
                  </span>
                  <span className="text-[10px] text-muted capitalize">{s.replace("_", " ")}</span>
                  <span className="text-[10px] text-muted">{Math.round((n / totalStatus) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
