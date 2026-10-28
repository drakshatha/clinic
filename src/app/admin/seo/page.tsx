import { requireStaff } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SearchConsoleWidget } from "@/components/admin/SearchConsoleWidget";

export default async function SeoPage() {
  const session = await requireStaff("view_leads");
  if (!session?.isOwner) redirect("/admin/dashboard");
  return (
    <div className="mx-auto w-[min(900px,100%)] space-y-8">
      <div>
        <h1 className="text-xl font-bold text-navy">SEO</h1>
        <p className="text-xs text-muted mt-0.5">Google Search Console performance</p>
      </div>
      <SearchConsoleWidget />
    </div>
  );
}
