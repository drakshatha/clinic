"use client";

import { useCallback, useEffect, useState } from "react";

type PageCheck = { path: string; label: string; priority: string; ok: boolean; status: number };
type SitemapCheck = { path: string; inSitemap: boolean };
type RobotsChecks = {
  exists: boolean;
  blocksAdmin: boolean;
  blocksApi: boolean;
  hasSitemap: boolean;
  allowsGooglebot: boolean;
  hasAiCrawlerRules: boolean;
};

type Data = {
  score: number;
  checkedAt: string;
  pages: PageCheck[];
  robots: { checks: RobotsChecks };
  sitemap: { totalUrls: number; checks: SitemapCheck[] };
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#1a7a4a" : score >= 60 ? "#92610a" : "#c0392b";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 44 44" className="w-16 h-16">
        <circle cx="22" cy="22" r="18" fill="none" stroke="#e2ddd8" strokeWidth="4" />
        <circle
          cx="22" cy="22" r="18" fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={`${(score / 100) * 113} 113`}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
        <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{score}</text>
      </svg>
      <p className="text-[11px] font-bold text-muted uppercase tracking-wide">Health Score</p>
    </div>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${ok ? "bg-green-500" : "bg-red-400"}`} />;
}

export function TechnicalSeoWidget() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"pages" | "robots" | "sitemap">("pages");

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/seo-health");
      if (!res.ok) throw new Error("Failed");
      setData(await res.json());
    } catch {
      setError("Could not run audit. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { run(); }, [run]);

  const failingPages = data?.pages.filter((p) => !p.ok) ?? [];
  const missingFromSitemap = data?.sitemap.checks.filter((c) => !c.inSitemap) ?? [];

  return (
    <div className="rounded-2xl border border-line bg-white p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔧</span>
          <div>
            <p className="text-xs font-bold text-navy">Technical SEO Health</p>
            <p className="text-[11px] text-muted">
              {data ? `Last checked ${new Date(data.checkedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Live page & crawl checks"}
            </p>
          </div>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="rounded-xl border border-line px-4 py-1.5 text-xs font-bold text-navy hover:bg-bg-soft transition-colors disabled:opacity-50"
        >
          {loading ? "Checking…" : "↺ Re-run"}
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {loading && !data && (
        <div className="flex items-center gap-2 text-xs text-muted py-4">
          <span className="animate-spin">⟳</span> Running checks on drakshatha.in…
        </div>
      )}

      {data && (
        <>
          {/* Score + summary */}
          <div className="flex gap-5 items-start flex-wrap">
            <ScoreRing score={data.score} />
            <div className="flex-1 min-w-0 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-bg-soft p-3 text-center">
                <p className="text-lg font-black text-navy">{data.pages.filter((p) => p.ok).length}/{data.pages.length}</p>
                <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">Pages OK</p>
              </div>
              <div className="rounded-xl bg-bg-soft p-3 text-center">
                <p className="text-lg font-black text-navy">{data.sitemap.totalUrls}</p>
                <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">In Sitemap</p>
              </div>
              <div className={`rounded-xl p-3 text-center ${failingPages.length > 0 || missingFromSitemap.length > 0 ? "bg-red-50" : "bg-green-50"}`}>
                <p className={`text-lg font-black ${failingPages.length > 0 || missingFromSitemap.length > 0 ? "text-red-600" : "text-green-600"}`}>
                  {failingPages.length + missingFromSitemap.length}
                </p>
                <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">Issues</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-line">
            {(["pages", "robots", "sitemap"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors border-b-2 -mb-px ${
                  tab === t ? "border-blue text-blue" : "border-transparent text-muted hover:text-navy"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Pages tab */}
          {tab === "pages" && (
            <div className="space-y-1.5">
              {data.pages.map((p) => (
                <div key={p.path} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2">
                  <StatusDot ok={p.ok} />
                  <span className="flex-1 text-xs font-medium text-navy truncate">{p.label}</span>
                  <span className="text-[10px] text-muted font-mono">{p.path}</span>
                  <span className={`text-[11px] font-bold ${p.ok ? "text-green-600" : "text-red-500"}`}>
                    {p.ok ? "200" : p.status || "ERR"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Robots tab */}
          {tab === "robots" && (
            <div className="space-y-1.5">
              {Object.entries(data.robots.checks).map(([key, val]) => {
                const labels: Record<string, string> = {
                  exists: "robots.txt exists",
                  blocksAdmin: "/admin/ is blocked",
                  blocksApi: "/api/ is blocked",
                  hasSitemap: "Sitemap URL declared",
                  allowsGooglebot: "Googlebot allowed",
                  hasAiCrawlerRules: "AI crawler rules (GPTBot etc)",
                };
                const isWarning = key === "hasAiCrawlerRules"; // optional, not critical
                return (
                  <div key={key} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2">
                    <StatusDot ok={val as boolean} />
                    <span className="flex-1 text-xs text-navy">{labels[key] ?? key}</span>
                    {!val && isWarning && (
                      <span className="text-[10px] text-amber-600 font-semibold">Optional</span>
                    )}
                    {!val && !isWarning && (
                      <span className="text-[10px] text-red-500 font-semibold">Fix needed</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sitemap tab */}
          {tab === "sitemap" && (
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted mb-2">{data.sitemap.totalUrls} total URLs · checking key pages</p>
              {data.sitemap.checks.map((c) => (
                <div key={c.path} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2">
                  <StatusDot ok={c.inSitemap} />
                  <span className="flex-1 text-xs font-mono text-navy">{c.path}</span>
                  <span className={`text-[11px] font-bold ${c.inSitemap ? "text-green-600" : "text-red-500"}`}>
                    {c.inSitemap ? "✓ In sitemap" : "✗ Missing"}
                  </span>
                </div>
              ))}
              <a
                href="https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Adrakshatha.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[11px] text-blue hover:underline"
              >
                View in Search Console ↗
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
