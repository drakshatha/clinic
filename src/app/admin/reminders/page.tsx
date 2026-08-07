import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { RemindersManager } from "@/components/admin/RemindersManager";

export default async function RemindersPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">🔔 Reminders</h1>
        <p className="text-sm text-muted mt-1">Automatic WhatsApp reminders for upcoming appointments.</p>
      </div>
      <RemindersManager />
    </div>
  );
}
