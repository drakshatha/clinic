import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { TreatmentPlanManager } from "@/components/admin/TreatmentPlanManager";

export const metadata = { title: "Treatment Plans – Admin" };

export default async function TreatmentPlansPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");
  return <TreatmentPlanManager />;
}
