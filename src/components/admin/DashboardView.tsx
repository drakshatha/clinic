"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────

type Period = "today" | "week" | "month" | "custom";

interface DashboardData {
  period: { from: string; to: string };
  leads: {
    total: number; pending: number; confirmed: number;
    completed: number; followup: number; cancelled: number; no_show: number;
  };
  revenue: {
    collected: number; pending: number;
    byMode: Record<string, number>; byModeCount: Record<string, number>;
  };
  visits: { total: number; byType: Record<string, number> };
  revenueByDay: { date: string; amount: number }[];
  todaySchedule: {
    id: string; name: string; phone: string; treatment: string;
    slotTime: string; status: string;
  }[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const IST_MS = 5.5 * 3600 * 1000;
const istToday = () => new Date(Date.now() + IST_MS).toISOString().slice(0, 10);

function getRange(
  period: Period, customFrom: string, customTo: string
): { from: string; to: string } | null {
  const today = istToday();
  if (period === "today") return { from: today, to: today };
  if (period === "week") {
    const d = new Date(Date.now() + IST_MS);
    d.setDate(d.getDate() - 6);
    return { from: d.toISOString().slice(0, 10), to: today };
  }
  if (period === "month") {
    const d = new Date(Date.now() + IST_MS);
    d.setDate(d.getDate() - 29);
    return { from: d.toISOString().slice(0, 10), to: today };
  }
  if (customFrom && customTo && customFrom <= customTo) {
    return { from: customFrom, to: customTo };
  }
  return null;
}

function fmtMoney(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short",
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  followup:  "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100  text-red-700",
  no_show:   "bg-gray-100 text-gray-600",
};

const VISIT_LABELS: Record<string, string> = {
  consultation: "1st Consultation",
  treatment:    "Treatment Session",
  followup:     "Follow-up",
  resolved:     "Case Resolved",
};

const VISIT_COLORS: Record<string, string> = {
  consultation: "bg-blue",
  treatment:    "bg-navy",
  followup:     "bg-purple-500",
  resolved:     "bg-green-600",
};

const MODE_LABELS: Record<string, string> = {
  cash:         "💵 Cash",
  upi:          "📱 UPI / GPay",
  card:         "💳 Card",
  online:       "🌐 Online Transfer",
  waived:       "🎁 Waived",
  pending:      "⏳ Payment Pending",
  not_recorded: "— Not Recorded",
};

// ── Bar Chart ─────────────────────────────────────────────────────────────────

function BarChart({ data }: { data: { date: string; amount: number }[] }) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  const hasData = data.some((d) => d.amount > 0);
  const CHART_H = 88; // px

  return (
    <div className="overflow-x-auto pb-1">
      <div
        className="flex gap-0.5 items-end"
        style={{
          height: `${CHART_H + 18}px`,
          minWidth: data.length > 14 ? `${data.length * 26}px` : "100%",
        }}
      >
        {data.map((d) => {
          const barH = d.amount > 0 ? Math.max((d.amount / max) * CHART_H, 5) : 2;
          const isZero = d.amount === 0;
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center justify-end gap-1 group"
              style={{ minWidth: "20px", height: `${CHART_H + 18}px` }}
            >
              {/* Bar */}
              <div
                className="relative w-full flex items-end"
                style={{ height: `${CHART_H}px` }}
              >
                {/* Tooltip */}
                {!isZero && (
                  <div className="absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy px-2 py-1 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-lg">
                    {fmtMoney(d.amount)}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy" />
                  </div>
                )}
                <div
                  style={{ height: `${barH}px`, width: "100%" }}
                  className={`rounded-t-sm transition-colors ${
                    isZero
                      ? "bg-line"
                      : "bg-blue group-hover:bg-blue-deep cursor-pointer"
                  }`}
                />
              </div>
              {/* X-axis label */}
              <span className="text-[8px] font-medium text-muted leading-none">
                {d.date.slice(5).replace("-", "/")}
              </span>
            </div>
          );
        })}
      </div>
      {!hasData && (
        <p className="mt-2 text-center text-xs text-muted">No payments recorded yet in this period</p>
      )}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub, accent,
}: {
  icon: string; label: string; value: string; sub: string;
  accent: "green" | "blue" | "navy" | "amber" | "purple";
}) {
  const bg: Record<string, string> = {
    green:  "bg-green-50  text-green-700",
    blue:   "bg-blue/10  text-blue",
    navy:   "bg-navy/8   text-navy",
    amber:  "bg-amber-50  text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div className="rounded-2xl border border-line bg-white p-5 flex flex-col gap-3">
      <span className={`self-start rounded-xl px-2.5 py-2 text-xl leading-none ${bg[accent]}`}>
        {icon}
      </span>
      <div>
        <p className="text-2xl font-extrabold text-navy tracking-tight">{value}</p>
        <p className="text-xs font-bold text-muted mt-0.5 uppercase tracking-wide">{label}</p>
        <p className="text-[11px] text-muted mt-1 leading-snug">{sub}</p>
      </div>
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl border border-line bg-white animate-pulse" />
        ))}
      </div>
      <div className="h-48 rounded-2xl border border-line bg-white animate-pulse" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-52 rounded-2xl border border-line bg-white animate-pulse" />
        <div className="h-52 rounded-2xl border border-line bg-white animate-pulse" />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function DashboardView() {
  const [period, setPeriod]       = useState<Period>("today");
  const [customFrom, setFrom]     = useState("");
  const [customTo,   setTo]       = useState("");
  const [data,       setData]     = useState<DashboardData | null>(null);
  const [loading,    setLoading]  = useState(true);
  const [error,      setError]    = useState("");

  const load = useCallback(async () => {
    const range = getRange(period, customFrom, customTo);
    if (!range) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/dashboard?from=${range.from}&to=${range.to}`);
      if (!res.ok) throw new Error("Failed to load dashboard data");
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  }, [period, customFrom, customTo]);

  useEffect(() => { load(); }, [load]);

  const today       = istToday();
  const isToday     = period === "today";
  const periodLabel = data
    ? data.period.from === data.period.to
      ? fmtDate(data.period.from)
      : `${fmtDate(data.period.from)} – ${fmtDate(data.period.to)}`
    : "";

  return (
    <div className="space-y-4 mx-auto w-[min(1100px,100%)]">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">Analytics</h1>
          {periodLabel && <p className="text-xs text-muted mt-0.5">{periodLabel}</p>}
        </div>

        {/* Period tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(["today", "week", "month", "custom"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                period === p
                  ? "bg-navy text-white shadow-sm"
                  : "border border-line text-muted hover:border-blue hover:text-blue bg-white"
              }`}
            >
              {p === "today" ? "Today" : p === "week" ? "This Week" : p === "month" ? "This Month" : "Custom"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Custom date pickers ── */}
      {period === "custom" && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4">
          <label className="flex items-center gap-2.5 text-xs font-bold text-navy">
            From
            <input
              type="date"
              value={customFrom}
              max={customTo || today}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-xl border border-line px-3 py-2 text-sm font-normal text-navy outline-none focus:border-blue"
            />
          </label>
          <span className="text-muted text-sm">→</span>
          <label className="flex items-center gap-2.5 text-xs font-bold text-navy">
            To
            <input
              type="date"
              value={customTo}
              min={customFrom}
              max={today}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-xl border border-line px-3 py-2 text-sm font-normal text-navy outline-none focus:border-blue"
            />
          </label>
          {customFrom && customTo && (
            <span className="text-xs text-muted ml-auto">
              {Math.round((new Date(customTo).getTime() - new Date(customFrom).getTime()) / 86400000) + 1} days
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <Skeleton />
      ) : data ? (
        <>
          {/* ── Stat Cards ── */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon="💰"
              label="Revenue Collected"
              value={fmtMoney(data.revenue.collected)}
              sub={
                data.revenue.pending > 0
                  ? `${fmtMoney(data.revenue.pending)} still pending`
                  : data.revenue.collected === 0 ? "No payments yet" : "All payments settled"
              }
              accent="green"
            />
            <StatCard
              icon="🦷"
              label="Visits Completed"
              value={String(data.visits.total)}
              sub={
                data.visits.total === 0
                  ? "No visits recorded yet"
                  : `across ${Object.keys(data.visits.byType).length} visit type${Object.keys(data.visits.byType).length !== 1 ? "s" : ""}`
              }
              accent="blue"
            />
            <StatCard
              icon="📋"
              label="Total Appointments"
              value={String(data.leads.total - data.leads.cancelled)}
              sub={
                `${data.leads.pending} pending · ${data.leads.confirmed} confirmed` +
                (data.leads.no_show > 0 ? ` · ${data.leads.no_show} no-show` : "")
              }
              accent="navy"
            />
            <StatCard
              icon="⏳"
              label="Needs Attention"
              value={String(data.leads.pending + data.leads.followup)}
              sub={`${data.leads.pending} unconfirmed · ${data.leads.followup} follow-up due`}
              accent={data.leads.pending + data.leads.followup > 0 ? "amber" : "navy"}
            />
          </div>

          {/* ── Today's Schedule ── */}
          {isToday && (
            <div className="rounded-2xl border border-line bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-line flex items-center justify-between">
                <h2 className="text-sm font-bold text-navy">Today's Schedule</h2>
                <span className="text-xs text-muted">{data.todaySchedule.length} appointment{data.todaySchedule.length !== 1 ? "s" : ""}</span>
              </div>
              {data.todaySchedule.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-muted">
                  No appointments scheduled for today.
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {data.todaySchedule.map((l) => (
                    <div key={l.id} className="flex items-center gap-4 px-5 py-3.5">
                      <span className="w-[72px] flex-shrink-0 text-xs font-bold text-navy tabular-nums">
                        {l.slotTime}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy leading-tight truncate">{l.name}</p>
                        <p className="text-xs text-muted truncate">{l.treatment || "—"}</p>
                      </div>
                      <a
                        href={`tel:${l.phone}`}
                        className="text-xs font-medium text-blue hover:underline flex-shrink-0 hidden sm:block"
                      >
                        {l.phone}
                      </a>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize flex-shrink-0 ${
                          STATUS_COLORS[l.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {l.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Revenue Trend Chart (week / month / custom) ── */}
          {!isToday && data.revenueByDay.length > 1 && (
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-navy">Revenue Trend</h2>
                <span className="text-xs text-muted">
                  Total: <span className="font-bold text-navy">{fmtMoney(data.revenueByDay.reduce((s, d) => s + d.amount, 0))}</span>
                </span>
              </div>
              <BarChart data={data.revenueByDay} />
            </div>
          )}

          {/* ── Breakdown ── */}
          <div className="grid gap-3 sm:grid-cols-2">

            {/* Visits by type */}
            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="text-sm font-bold text-navy mb-4">Visits by Type</h2>
              {data.visits.total === 0 ? (
                <p className="text-sm text-muted py-4 text-center">No visits recorded in this period.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {Object.entries(VISIT_LABELS).map(([key, label]) => {
                    const count = data.visits.byType[key] ?? 0;
                    const pct = data.visits.total > 0 ? (count / data.visits.total) * 100 : 0;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-navy">{label}</span>
                          <span className="text-xs font-extrabold text-navy tabular-nums">
                            {count}
                            <span className="font-normal text-muted ml-1">
                              ({Math.round(pct)}%)
                            </span>
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-bg-soft overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${VISIT_COLORS[key] ?? "bg-blue"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-1 mt-1 border-t border-line flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Visits</span>
                    <span className="text-sm font-extrabold text-navy">{data.visits.total}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Revenue by mode */}
            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="text-sm font-bold text-navy mb-4">Revenue by Payment Mode</h2>
              {Object.keys(data.revenue.byMode).length === 0 ? (
                <p className="text-sm text-muted py-4 text-center">No payments recorded in this period.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {Object.entries(data.revenue.byMode)
                    .sort(([, a], [, b]) => b - a)
                    .map(([mode, amount]) => (
                      <div key={mode} className="flex items-center justify-between gap-3">
                        <span className="text-sm text-navy">{MODE_LABELS[mode] ?? mode}</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-navy tabular-nums">
                            {fmtMoney(amount)}
                          </span>
                          <span className="text-[11px] text-muted">
                            × {data.revenue.byModeCount[mode] ?? 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  <div className="mt-1 pt-3 border-t border-line flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Collected</span>
                    <span className="text-lg font-extrabold text-navy">{fmtMoney(data.revenue.collected)}</span>
                  </div>
                  {data.revenue.pending > 0 && (
                    <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-800">Pending collection</span>
                      <span className="text-sm font-bold text-amber-900">{fmtMoney(data.revenue.pending)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Quick link to leads ── */}
          <div className="flex justify-center pb-2">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
            >
              📋 View All Leads & Appointments →
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
