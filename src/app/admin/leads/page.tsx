import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const metadata = {
  title: "Leads – Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  return (
    <div className="mx-auto w-[min(1100px,100%)]">
      <LeadsTable />
    </div>
  );
}
