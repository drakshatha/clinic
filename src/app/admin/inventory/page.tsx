import { requireStaff } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InventoryManager } from "@/components/admin/InventoryManager";

export default async function InventoryPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");
  return <InventoryManager />;
}
