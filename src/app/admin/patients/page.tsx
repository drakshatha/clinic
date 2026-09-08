import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { PatientsManager } from "@/components/admin/PatientsManager";

export const metadata = {
  title: "Patients – Admin",
  robots: { index: false, follow: false },
};

export default async function PatientsPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");

  return <PatientsManager />;
}
