import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  return (
    <div className="bg-bg px-4 py-24">
      <div className="mx-auto w-[min(1200px,100%)]">
        <LeadsTable />
      </div>
    </div>
  );
}
