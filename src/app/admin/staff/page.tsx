import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { StaffManager } from "@/components/admin/StaffManager";

export const metadata = {
  title: "Staff – Admin",
  robots: { index: false, follow: false },
};

export default async function StaffPage() {
  const session = await requireStaff(["doctor"]);
  if (!session) redirect("/admin");

  return (
    <div className="mx-auto w-[min(700px,100%)]">
      <StaffManager />
    </div>
  );
}
