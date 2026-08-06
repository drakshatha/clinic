import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <AdminShell user={{ name: session.name, role: session.role, permissions: session.permissions }}>
      {children}
    </AdminShell>
  );
}
