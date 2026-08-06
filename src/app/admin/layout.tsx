import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    // Login page — no shell
    return <>{children}</>;
  }

  return (
    <AdminShell user={{ name: session.name, role: session.role }}>
      {children}
    </AdminShell>
  );
}
