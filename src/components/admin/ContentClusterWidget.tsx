"use client";

import Link from "next/link";

const GAP_PAGES = [
  {
    priority: "HIGH",
    priorityColor: "bg-red-100 text-red-700",
    title: "All-on-4 Dental Implants Bangalore",
    url: "/all-on-4-dental-implants-bangalore",
    keyword: "all on 4 dental implants bangalore",
    status: "created",
    est: "150–400 impressions/mo",
    cluster: "Dental Implants",
  },
  {
    priority: "MEDIUM",
    priorityColor: "bg-amber-100 text-amber-700",
    title: "Smile Makeover Cost Bangalore",
    url: "/smile-makeover-cost-bangalore",
    keyword: "smile makeover cost bangalore",
    status: "created",
    est: "80–200 impressions/mo",
    cluster: "Smile Makeover & Cosmetic",
  },
  {
    priority: "LOW",
    priorityColor: "bg-green-100 text-green-700",
    title: "Zirconia Crowns vs PFM Crowns",
    url: "/blog/zirconia-crowns-bangalore",
    keyword: "zirconia crown bangalore",
    status: "created",
    est: "50–120 impressions/mo",
    cluster: "Authority & Informational",
  },
];

const CANNIBALIZATION = {
  page1: "/dental-implant-cost-bangalore",
  page2: "/blog/dental-implant-cost-bengaluru",
  keyword: "dental implant cost bangalore",
  fix: "Keep landing page transactional ('from ₹25,000 · Book now'). Pivot blog title/H1 to informational ('What determines implant cost'). Both pages can coexist once intent signals differ.",
};

export function ContentClusterWidget() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {GAP_PAGES.map((page) => (
          <div
            key={page.url}
            className="rounded-xl border border-line bg-white p-4 flex items-start gap-3"
          >
            <div className="flex-shrink-0 mt-0.5">
              {page.status === "created" ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
              ) : (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 text-xs font-bold">!</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${page.priorityColor}`}>
                  {page.priority}
                </span>
                <span className="text-[10px] text-muted">{page.cluster}</span>
              </div>
              <p className="text-sm font-semibold text-navy leading-snug">{page.title}</p>
              <p className="text-xs text-muted mt-0.5 font-mono truncate">{page.url}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-xs text-muted">
                  Keyword: <span className="text-navy font-medium">{page.keyword}</span>
                </span>
                <span className="text-xs text-muted">{page.est}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              {page.status === "created" ? (
                <Link
                  href={page.url}
                  target="_blank"
                  className="text-[11px] font-semibold text-blue hover:underline"
                >
                  View →
                </Link>
              ) : (
                <span className="text-[11px] font-semibold text-amber-600">Build next</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700 mb-2">⚠ Cannibalization Issue</p>
        <div className="flex gap-2 flex-wrap mb-2">
          <code className="text-xs bg-white border border-amber-200 rounded px-1.5 py-0.5 text-amber-800">{CANNIBALIZATION.page1}</code>
          <span className="text-xs text-amber-700 self-center">vs</span>
          <code className="text-xs bg-white border border-amber-200 rounded px-1.5 py-0.5 text-amber-800">{CANNIBALIZATION.page2}</code>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          Both target <strong>{CANNIBALIZATION.keyword}</strong>. {CANNIBALIZATION.fix}
        </p>
      </div>

      <div className="rounded-xl border border-line bg-bg-soft p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted mb-3">Pending Internal Links (add after page creation)</p>
        <div className="space-y-1.5 text-xs text-muted">
          <div className="flex gap-2">
            <span className="text-red-500">→</span>
            <span><code className="text-navy">/services/dental-implants</code> → All-on-4 page (anchor: "all-on-4 full arch implants")</span>
          </div>
          <div className="flex gap-2">
            <span className="text-red-500">→</span>
            <span><code className="text-navy">/dental-implant-cost-bangalore</code> → All-on-4 page (anchor: "all-on-4 dental implants cost")</span>
          </div>
          <div className="flex gap-2">
            <span className="text-amber-500">→</span>
            <span><code className="text-navy">/services/cosmetic-smile-makeover</code> → Smile makeover cost page (anchor: "smile makeover cost breakdown")</span>
          </div>
          <div className="flex gap-2">
            <span className="text-amber-500">→</span>
            <span><code className="text-navy">/services/crowns-bridges</code> → Zirconia crowns blog post (anchor: "zirconia vs PFM crowns")</span>
          </div>
        </div>
      </div>
    </div>
  );
}
