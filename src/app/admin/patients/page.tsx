import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { PatientsManager } from "@/components/admin/PatientsManager";

export default async function PatientsPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");

  return (
    <AdminShell user={{ name: session.name, role: session.role, permissions: session.permissions }}>
      <PatientsManager />
    </AdminShell>
  );
}
