"use client";

import { useEffect, useState } from "react";

type Overview = { clicks: number; impressions: number; ctr: number; position: number };
type QueryRow = { query: string; clicks: number; impressions: number; position: number };
type PageRow  = { page: string; clicks: number; impressions: number };

type Data =
  | { configured: false }
  | { configured: true; period: string; overview: Overview; queries: QueryRow[]; pages: PageRow[] }
  | { error: string };

const DAYS_OPTIONS = [7, 28, 90] as const;

function StatCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-1 ${highlight ? "border-blue/40 bg-blue/5" : "border-line bg-white"}`}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="text-2xl font-black text-navy">{value}</p>
      {sub && <p className="text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

function QuickLinks() {
  const links = [
    { label: "Search Console", href: "https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Adrakshatha.in", icon: "📊" },
    { label: "Google Business Profile", href: "https://business.google.com/dashboard", icon: "🏥" },
    { label: "PageSpeed Insights", href: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdrakshatha.in", icon: "⚡" },
    { label: "Google Analytics", href: "https://analytics.google.com", icon: "📈" },
    { label: "Index Coverage", href: "https://search.google.com/search-console/index?resource_id=sc-domain%3Adrakshatha.in", icon: "🗂️" },
    { label: "Sitemap", href: "https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Adrakshatha.in", icon: "🗺️" },
    { label: "Rich Results Test", href: "https://search.google.com/test/rich-results?url=https%3A%2F%2Fdrakshatha.in", icon: "✅" },
    { label: "Mobile Friendly Test", href: "https://search.google.com/test/mobile-friendly?url=https%3A%2F%2Fdrakshatha.in", icon: "📱" },
  ];
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-bold text-navy mb-3">Quick Links</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-line p-3 text-center hover:border-blue/40 hover:bg-blue/5 transition-colors"
          >
            <span className="text-xl">{l.icon}</span>
            <span className="text-[11px] font-semibold text-navy leading-tight">{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function OpportunitiesPanel({ queries }: { queries: QueryRow[] }) {
  const opps = queries
    .filter((q) => q.impressions >= 5 && q.clicks === 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 8);

  if (opps.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🎯</span>
        <p className="text-xs font-bold text-navy">Quick Wins — High Impressions, Zero Clicks</p>
      </div>
      <p className="text-[11px] text-muted mb-3">These queries show your site in results but nobody clicks. Improving the title/description for those pages could bring free traffic.</p>
      <div className="space-y-1.5">
        {opps.map((q) => (
          <div key={q.query} className="flex items-center gap-3 rounded-lg bg-white border border-amber-100 px-3 py-2">
            <span className="flex-1 text-xs text-navy truncate">{q.query}</span>
            <span className="text-[11px] text-muted shrink-0">{q.impressions} impr.</span>
            <span className="text-[11px] text-muted shrink-0">pos. {q.position}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchConsoleWidget() {
  const [days, setDays] = useState<7 | 28 | 90>(28);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    setData(null);
    fetch(`/api/admin/search-console?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: "Network error" }));
  }, [days]);

  if (!data) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-6 w-48 rounded bg-line" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 rounded-2xl bg-white border border-line" />)}
        </div>
        <div className="h-48 rounded-2xl bg-white border border-line" />
      </div>
    );
  }

  if ("error" in data) {
    return <p className="text-xs text-red-600 rounded-xl border border-red-200 bg-red-50 p-3">Search Console error: {data.error}</p>;
  }

  if (!data.configured) {
    return (
      <div className="rounded-2xl border border-dashed border-blue/40 bg-blue-50/30 p-5 space-y-2">
        <p className="font-bold text-navy">Search Console not connected</p>
        <p className="text-xs text-muted">Add <code className="bg-white border border-line rounded px-1">GSC_CLIENT_ID</code>, <code className="bg-white border border-line rounded px-1">GSC_CLIENT_SECRET</code>, and <code className="bg-white border border-line rounded px-1">GSC_REFRESH_TOKEN</code> in Vercel environment variables.</p>
      </div>
    );
  }

  const { overview, queries, pages, period } = data;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-bold text-navy">Google Search Console</p>
          <p className="text-[11px] text-muted">{period} · organic search</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-line bg-white p-1">
          {DAYS_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                days === d ? "bg-navy text-white" : "text-muted hover:text-navy"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Clicks"       value={String(overview.clicks)}                        sub="Visits from Google" highlight />
        <StatCard label="Impressions"  value={overview.impressions.toLocaleString("en-IN")}   sub="Times shown" />
        <StatCard label="Avg CTR"      value={`${overview.ctr}%`}                             sub="Click-through rate" />
        <StatCard label="Avg Position" value={String(overview.position)}                      sub="Google ranking" />
      </div>

      {/* Opportunities */}
      <OpportunitiesPanel queries={queries} />

      {/* Tables */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-bold text-navy mb-3">Top Search Queries</p>
          {queries.length === 0 ? (
            <p className="text-xs text-muted italic">No data yet.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted text-left">
                  <th className="pb-2 font-semibold">Query</th>
                  <th className="pb-2 font-semibold text-right w-12">Clicks</th>
                  <th className="pb-2 font-semibold text-right w-16">Impr.</th>
                  <th className="pb-2 font-semibold text-right w-14">Pos.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {queries.map((q) => (
                  <tr key={q.query}>
                    <td className="py-1.5 text-navy truncate max-w-[130px]">{q.query}</td>
                    <td className="py-1.5 text-right font-bold text-blue">{q.clicks}</td>
                    <td className="py-1.5 text-right text-muted">{q.impressions}</td>
                    <td className="py-1.5 text-right text-muted">{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-bold text-navy mb-3">Top Pages</p>
          {pages.length === 0 ? (
            <p className="text-xs text-muted italic">No data yet.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted text-left">
                  <th className="pb-2 font-semibold">Page</th>
                  <th className="pb-2 font-semibold text-right w-12">Clicks</th>
                  <th className="pb-2 font-semibold text-right w-16">Impr.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pages.map((p) => (
                  <tr key={p.page}>
                    <td className="py-1.5 text-navy truncate max-w-[170px] font-mono text-[10px]">{p.page}</td>
                    <td className="py-1.5 text-right font-bold text-blue">{p.clicks}</td>
                    <td className="py-1.5 text-right text-muted">{p.impressions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick links */}
      <QuickLinks />
    </div>
  );
}
