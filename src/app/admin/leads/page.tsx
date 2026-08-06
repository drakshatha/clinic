import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllLeads } from "@/lib/db";
import { formatIstDateTime, formatSlotLabel } from "@/lib/time";
import { LeadsTable } from "@/components/admin/LeadsTable";
import type { Permission } from "@/lib/permissions";

export const metadata = {
  title: "Leads – Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  // Pre-fetch leads on the server — table renders immediately, no loading spinner
  const leads = await getAllLeads();
  const enriched = leads.map((l) => ({
    ...l,
    created_at_ist: formatIstDateTime(l.created_at),
    slot_label: formatSlotLabel(l.slot_date, l.slot_time),
    confirmed_at_ist: l.confirmed_at ? formatIstDateTime(l.confirmed_at) : null,
  }));

  const user = { name: session.name, role: session.role, permissions: session.permissions as Permission[] };

  return (
    <div className="mx-auto w-[min(1100px,100%)]">
      <LeadsTable initialLeads={enriched} initialUser={user} />
    </div>
  );
}
