import { requireStaff } from "@/lib/auth";
import { ContentManager } from "@/components/admin/ContentManager";

export default async function ContentPage() {
  await requireStaff("view_leads");
  return <ContentManager />;
}
