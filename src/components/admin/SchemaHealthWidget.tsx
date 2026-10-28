"use client";

const SCHEMA_CHECKS = [
  {
    page: "Homepage (/)",
    schemas: ["Dentist + MedicalBusiness", "WebSite", "BreadcrumbList"],
    status: "pass",
    note: "Correct geo (13.00261, 77.55663), has @id. layout.tsx handles this for all pages.",
  },
  {
    page: "Dental Implant Cost",
    schemas: ["BreadcrumbList", "FAQPage"],
    status: "pass",
    note: "FAQPage no longer generates rich results (retired May 2026) but valid for structured data.",
  },
  {
    page: "All-on-4 Implants",
    schemas: ["BreadcrumbList", "FAQPage"],
    status: "pass",
    note: "New page. BreadcrumbList + FAQPage. No duplicate LocalBusiness.",
  },
  {
    page: "Blog posts",
    schemas: ["Article", "BreadcrumbList"],
    status: "pass",
    note: "datePublished, dateModified, and author (Person with @id) all set in blog/[slug]/page.tsx.",
  },
  {
    page: "Services pages",
    schemas: ["MedicalProcedure", "Service"],
    status: "pass",
    note: "serviceType and areaServed: Bengaluru added. Dual @type ['MedicalProcedure','Service'] for AI search visibility.",
  },
];

const ISSUES_FIXED = [
  {
    issue: "Duplicate Dentist+MedicalBusiness schema",
    severity: "critical",
    fix: "Removed from page.tsx — now only in layout.tsx with correct coords",
    status: "fixed",
  },
  {
    issue: "Wrong geo coordinates in page.tsx",
    severity: "critical",
    fix: "Old: 12.9916, 77.5533 → Correct: 13.00261, 77.55663 (from layout.tsx)",
    status: "fixed",
  },
  {
    issue: "Missing @id on LocalBusiness in page.tsx",
    severity: "high",
    fix: "Moot — duplicate removed. layout.tsx has @id set to site.url",
    status: "fixed",
  },
];

const OPPORTUNITIES = [
  "Add AggregateRating to LocalBusiness once verified Google reviews reach 10+ (currently 50 reviews — add ratingValue: 4.9)",
  "Add Physician (Person) schema to /about with MedicalSpecialty: Prosthodontics",
  "Add MedicalProcedure schema to /all-on-4-dental-implants-bangalore with bodyLocation and preparation fields",
];

export function SchemaHealthWidget() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {SCHEMA_CHECKS.map((check) => (
          <div key={check.page} className="rounded-xl border border-line bg-white p-4 flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {check.status === "pass" ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
              ) : (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-bold">?</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy">{check.page}</p>
              <div className="flex gap-1.5 flex-wrap mt-1 mb-1.5">
                {check.schemas.map((s) => (
                  <span key={s} className="rounded bg-bg-soft border border-line text-xs px-1.5 py-0.5 text-navy font-mono">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted leading-relaxed">{check.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-white p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted mb-3">Issues Fixed This Session</p>
        <div className="space-y-2">
          {ISSUES_FIXED.map((item) => (
            <div key={item.issue} className="flex gap-2.5">
              <span className="flex-shrink-0 text-green-600 text-xs font-bold mt-0.5">✓</span>
              <div>
                <p className="text-xs font-semibold text-navy">{item.issue}</p>
                <p className="text-xs text-muted">{item.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-blue/20 bg-blue/5 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-blue mb-3">Schema Opportunities</p>
        <ul className="space-y-1.5">
          {OPPORTUNITIES.map((opp) => (
            <li key={opp} className="flex gap-2 text-xs text-muted">
              <span className="flex-shrink-0 text-blue mt-0.5">›</span>
              <span>{opp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
