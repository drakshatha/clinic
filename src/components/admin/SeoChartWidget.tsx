"use client";

import { useEffect, useState } from "react";

type Overview = { clicks: number; impressions: number; ctr: number; position: number };
type QueryRow = { query: string; clicks: number; impressions: number; position: number };
type PageRow  = { page: string; clicks: number; impressions: number };
type Data =
  | { configured: false }
  | { configured: true; period: string; overview: Overview; queries: QueryRow[]; pages: PageRow[] }
  | { error: string };

const CLUSTER_DATA = [
  { name: "Dental Implants",       total: 5, existing: 5, color: "#2563eb" },
  { name: "Full Mouth Rehab",       total: 3, existing: 3, color: "#7c3aed" },
  { name: "Teeth Replacement",      total: 3, existing: 3, color: "#059669" },
  { name: "Smile Makeover",         total: 3, existing: 3, color: "#d97706" },
  { name: "Authority / Info",       total: 3, existing: 3, color: "#64748b" },
];
const TOTAL_PAGES  = CLUSTER_DATA.reduce((s, c) => s + c.total, 0);
const BUILT_PAGES  = CLUSTER_DATA.reduce((s, c) => s + c.existing, 0);

function Bar({ label, value, max, secondary, secondaryLabel }: {
  label: string; value: number; max: number; secondary?: number; secondaryLabel?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const secPct = secondary != null && max > 0 ? Math.round((secondary / max) * 100) : 0;
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1 gap-2">
        <span className="text-[11px] text-navy font-mono truncate max-w-[200px]">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          {secondary != null && (
            <span className="text-[11px] font-bold text-blue">{secondary} clk</span>
          )}
          <span className="text-[11px] text-muted">{value.toLocaleString("en-IN")} impr</span>
        </div>
      </div>
      <div className="relative h-5 rounded-full bg-line overflow-hidden">
        {/* impressions bar */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-navy/10 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
        {/* clicks bar */}
        {secondary != null && secPct > 0 && (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-blue transition-all duration-500"
            style={{ width: `${secPct}%` }}
          />
        )}
      </div>
    </div>
  );
}

function DonutRing({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-line, #e5e7eb)" strokeWidth={10} />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

export function SeoChartWidget() {
  const [data, setData] = useState<Data | null>(null);
  const [view, setView] = useState<"pages" | "queries">("pages");

  useEffect(() => {
    fetch("/api/admin/search-console?days=28")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: "Network error" }));
  }, []);

  const clusterPct = Math.round((BUILT_PAGES / TOTAL_PAGES) * 100);

  return (
    <div className="space-y-5">

      {/* ── Cluster Coverage ── */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-navy">Content Cluster Coverage</p>
            <p className="text-[11px] text-muted mt-0.5">{BUILT_PAGES}/{TOTAL_PAGES} pages built · all 3 gaps filled</p>
          </div>
          <div className="relative flex-shrink-0">
            <DonutRing pct={clusterPct} color="#2563eb" size={72} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-navy">{clusterPct}%</span>
          </div>
        </div>
        <div className="space-y-2">
          {CLUSTER_DATA.map((c) => {
            const p = Math.round((c.existing / c.total) * 100);
            return (
              <div key={c.name} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: c.color }}
                />
                <span className="text-[11px] text-navy flex-1 min-w-0 truncate">{c.name}</span>
                <div className="flex-1 max-w-[120px] h-2 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p}%`, background: c.color }}
                  />
                </div>
                <span className="text-[11px] text-muted w-10 text-right shrink-0">{c.existing}/{c.total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── GSC chart ── */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <p className="text-xs font-bold text-navy">Impressions vs Clicks — Last 28 Days</p>
            <p className="text-[11px] text-muted mt-0.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue mr-1 align-middle" />clicks ·&nbsp;
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-navy/10 border border-navy/20 mr-1 align-middle" />impressions
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-line p-0.5">
            {(["pages", "queries"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1 text-[11px] font-bold transition-colors capitalize ${
                  view === v ? "bg-navy text-white" : "text-muted hover:text-navy"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {!data ? (
          <div className="space-y-2 animate-pulse">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="h-7 rounded bg-line" style={{ width: `${85 - i * 8}%` }} />
            ))}
          </div>
        ) : "error" in data ? (
          <p className="text-xs text-muted italic">GSC not connected — connect Search Console to see chart data.</p>
        ) : !data.configured ? (
          <p className="text-xs text-muted italic">Connect Search Console to see impressions & clicks chart.</p>
        ) : (() => {
          const rows = view === "pages"
            ? data.pages.slice(0, 10).map((p) => ({
                label: p.page.replace("https://drakshatha.in", "") || "/",
                impressions: p.impressions,
                clicks: p.clicks,
              }))
            : data.queries.slice(0, 10).map((q) => ({
                label: q.query,
                impressions: q.impressions,
                clicks: q.clicks,
              }));
          const maxImpr = Math.max(...rows.map((r) => r.impressions), 1);
          return (
            <div className="space-y-3">
              {rows.map((r) => (
                <Bar
                  key={r.label}
                  label={r.label}
                  value={r.impressions}
                  max={maxImpr}
                  secondary={r.clicks}
                />
              ))}
              {rows.length === 0 && (
                <p className="text-xs text-muted italic">No data for this period yet.</p>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── CTR opportunity band ── */}
      {data && "configured" in data && data.configured && (() => {
        const lowCtr = data.queries
          .filter((q) => q.impressions >= 10 && q.clicks / q.impressions < 0.03)
          .sort((a, b) => b.impressions - a.impressions)
          .slice(0, 5);
        if (lowCtr.length === 0) return null;
        return (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-xs font-bold text-navy mb-1">CTR Opportunity — High Impressions, Low Click Rate</p>
            <p className="text-[11px] text-muted mb-3">Queries appearing in Google results but rarely clicked. Improving the title tag or meta description for these pages can lift traffic without any new content.</p>
            <div className="space-y-1.5">
              {lowCtr.map((q) => {
                const ctr = ((q.clicks / q.impressions) * 100).toFixed(1);
                return (
                  <div key={q.query} className="flex items-center gap-3 text-[11px] bg-white rounded-lg border border-amber-100 px-3 py-2">
                    <span className="flex-1 text-navy truncate">{q.query}</span>
                    <span className="text-muted shrink-0">{q.impressions} impr</span>
                    <span className="text-amber-700 font-bold shrink-0">{ctr}% CTR</span>
                    <span className="text-muted shrink-0">pos {q.position}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
