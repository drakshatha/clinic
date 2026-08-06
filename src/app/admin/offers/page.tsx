import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { OffersManager } from "@/components/admin/OffersManager";

export const metadata = {
  title: "Offers – Admin",
  robots: { index: false, follow: false },
};

export default async function AdminOffersPage() {
  const session = await requireStaff("manage_staff");
  if (!session) redirect("/admin");

  return <OffersManager />;
}
