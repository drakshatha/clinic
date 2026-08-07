import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { RecallManager } from "@/components/admin/RecallManager";

export const metadata = { title: "Recall & Birthdays – Admin" };

export default async function RecallPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");
  return <RecallManager />;
}
