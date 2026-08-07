import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { PaymentsTracker } from "@/components/admin/PaymentsTracker";

export default async function PaymentsPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");

  return (
    <AdminShell user={{ name: session.name, role: session.role, permissions: session.permissions }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">💰 Payments</h1>
        <p className="text-sm text-muted mt-1">Consultations with missing or pending payment records.</p>
      </div>
      <PaymentsTracker />
    </AdminShell>
  );
}
