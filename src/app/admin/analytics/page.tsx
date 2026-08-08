import { requireStaff } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalyticsManager } from "@/components/admin/AnalyticsManager";

export default async function AnalyticsPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");
  return (
    <div className="mx-auto w-[min(900px,100%)] space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy">Analytics</h1>
        <p className="text-xs text-muted mt-0.5">Revenue, visits, and clinic performance</p>
      </div>
      <AnalyticsManager />
    </div>
  );
}
