import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { LabWorkTracker } from "@/components/admin/LabWorkTracker";

export const metadata = { title: "Lab Work – Admin" };

export default async function LabWorkPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");
  return <LabWorkTracker />;
}
