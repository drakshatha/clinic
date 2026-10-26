"use client";

import { useEffect, useState } from "react";

type Overview = { clicks: number; impressions: number; ctr: number; position: number };
type QueryRow = { query: string; clicks: number; impressions: number; position: number };
type PageRow  = { page: string; clicks: number; impressions: number };

type Data =
  | { configured: false }
  | { configured: true; period: string; overview: Overview; queries: QueryRow[]; pages: PageRow[] }
  | { error: string };

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 flex flex-col gap-1">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="text-2xl font-black text-navy">{value}</p>
      {sub && <p className="text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

function SetupCard() {
  return (
    <div className="rounded-2xl border border-dashed border-blue/40 bg-blue-50/30 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🔌</span>
        <p className="font-bold text-navy">Connect Google Search Console</p>
      </div>
      <p className="text-xs text-muted">Add one env var in Vercel to see live search data here.</p>
      <ol className="text-xs text-muted space-y-2 list-decimal ml-4">
        <li>
          Go to <strong className="text-navy">console.cloud.google.com</strong> → IAM &amp; Admin → Service Accounts → Create service account (any name).
        </li>
        <li>
          Click the service account → Keys → Add Key → JSON → Download the file.
        </li>
        <li>
          In <strong className="text-navy">Search Console</strong> → Settings → Users and permissions → Add user → paste the service account email → role: <em>Full</em>.
        </li>
        <li>
          In your terminal, run:<br />
          <code className="block mt-1 bg-white border border-line rounded px-2 py-1 font-mono text-[11px] text-navy select-all">
            base64 -i service-account.json | pbcopy
          </code>
        </li>
        <li>
          In <strong className="text-navy">Vercel → Settings → Environment Variables</strong>, add:<br />
          <code className="block mt-1 bg-white border border-line rounded px-2 py-1 font-mono text-[11px] text-navy">GSC_SERVICE_ACCOUNT_JSON</code> → paste the copied base64 value → Redeploy.
        </li>
      </ol>
    </div>
  );
}

export function SearchConsoleWidget() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch("/api/admin/search-console")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: "Network error" }));
  }, []);

  if (!data) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-6 w-48 rounded bg-line" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white border border-line" />
          ))}
        </div>
        <div className="h-48 rounded-2xl bg-white border border-line" />
      </div>
    );
  }

  if ("error" in data) {
    return (
      <p className="text-xs text-red-600 rounded-xl border border-red-200 bg-red-50 p-3">
        Search Console error: {data.error}
      </p>
    );
  }

  if (!data.configured) return <SetupCard />;

  const { overview, queries, pages, period } = data;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-navy">Search Console</p>
          <p className="text-[11px] text-muted">{period} · Google organic search</p>
        </div>
        <a
          href="https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Adrakshatha.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-blue hover:underline"
        >
          Open Search Console ↗
        </a>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Clicks"      value={String(overview.clicks)}      sub="Visits from Google" />
        <StatCard label="Impressions" value={overview.impressions.toLocaleString("en-IN")} sub="Times shown in results" />
        <StatCard label="Avg CTR"     value={`${overview.ctr}%`}           sub="Click-through rate" />
        <StatCard label="Avg Position" value={String(overview.position)}   sub="Google ranking" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Top queries */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-bold text-navy mb-3">Top Search Queries</p>
          {queries.length === 0 ? (
            <p className="text-xs text-muted italic">No query data yet.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted text-left">
                  <th className="pb-2 font-semibold">Query</th>
                  <th className="pb-2 font-semibold text-right w-14">Clicks</th>
                  <th className="pb-2 font-semibold text-right w-20">Impr.</th>
                  <th className="pb-2 font-semibold text-right w-16">Pos.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {queries.map((q) => (
                  <tr key={q.query}>
                    <td className="py-1.5 text-navy truncate max-w-[140px]">{q.query}</td>
                    <td className="py-1.5 text-right font-bold text-blue">{q.clicks}</td>
                    <td className="py-1.5 text-right text-muted">{q.impressions}</td>
                    <td className="py-1.5 text-right text-muted">{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top pages */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-bold text-navy mb-3">Top Pages</p>
          {pages.length === 0 ? (
            <p className="text-xs text-muted italic">No page data yet.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted text-left">
                  <th className="pb-2 font-semibold">Page</th>
                  <th className="pb-2 font-semibold text-right w-14">Clicks</th>
                  <th className="pb-2 font-semibold text-right w-20">Impr.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pages.map((p) => (
                  <tr key={p.page}>
                    <td className="py-1.5 text-navy truncate max-w-[180px] font-mono text-[10px]">{p.page}</td>
                    <td className="py-1.5 text-right font-bold text-blue">{p.clicks}</td>
                    <td className="py-1.5 text-right text-muted">{p.impressions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
