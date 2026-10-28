import { requireStaff } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SearchConsoleWidget } from "@/components/admin/SearchConsoleWidget";
import { ReviewRequestWidget } from "@/components/admin/ReviewRequestWidget";
import { TechnicalSeoWidget } from "@/components/admin/TechnicalSeoWidget";
import { ContentClusterWidget } from "@/components/admin/ContentClusterWidget";
import { SchemaHealthWidget } from "@/components/admin/SchemaHealthWidget";
import { SeoChartWidget } from "@/components/admin/SeoChartWidget";

export default async function SeoPage() {
  const session = await requireStaff("view_leads");
  if (!session?.isOwner) redirect("/admin/dashboard");
  return (
    <div className="mx-auto w-[min(900px,100%)] space-y-8">
      <div>
        <h1 className="text-xl font-bold text-navy">SEO</h1>
        <p className="text-xs text-muted mt-0.5">Search performance, schema health, content gaps & review management</p>
      </div>

      <SearchConsoleWidget />

      <div>
        <div className="mb-3 border-t border-line pt-6">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Performance Charts</p>
          <p className="text-xs text-muted mt-0.5">Content cluster coverage · Impressions vs clicks · CTR opportunities</p>
        </div>
        <SeoChartWidget />
      </div>

      <div>
        <div className="mb-3 border-t border-line pt-6">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Technical Health</p>
        </div>
        <TechnicalSeoWidget />
      </div>

      <div>
        <div className="mb-3 border-t border-line pt-6">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Schema Health</p>
          <p className="text-xs text-muted mt-0.5">Structured data audit — issues fixed and opportunities</p>
        </div>
        <SchemaHealthWidget />
      </div>

      <div>
        <div className="mb-3 border-t border-line pt-6">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Content Cluster</p>
          <p className="text-xs text-muted mt-0.5">Hub-and-spoke gap pages, cannibalization issues, pending internal links</p>
        </div>
        <ContentClusterWidget />
      </div>

      <div>
        <div className="mb-3 border-t border-line pt-6">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Review Management</p>
        </div>
        <ReviewRequestWidget />
      </div>
    </div>
  );
}
