import { requireStaff } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalyticsManager } from "@/components/admin/AnalyticsManager";
import { SearchConsoleWidget } from "@/components/admin/SearchConsoleWidget";

export default async function AnalyticsPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");
  return (
    <div className="mx-auto w-[min(900px,100%)] space-y-8">
      <div>
        <h1 className="text-xl font-bold text-navy">Analytics</h1>
        <p className="text-xs text-muted mt-0.5">Revenue, visits, and clinic performance</p>
      </div>
      <AnalyticsManager />

      {/* Search Console — doctor/owner only */}
      {session.isOwner && (
        <div>
          <div className="mb-1 border-t border-line pt-6">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Search Performance</p>
          </div>
          <SearchConsoleWidget />
        </div>
      )}
    </div>
  );
}
