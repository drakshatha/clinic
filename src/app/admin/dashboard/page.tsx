import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardStats, toIstDate } from "@/lib/dashboard";
import { DashboardView } from "@/components/admin/DashboardView";

export const metadata = {
  title: "Analytics – Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  // Pre-fetch today's stats on the server — no HTTP round-trip, no loading spinner on first open
  const today = toIstDate(new Date());
  const initialData = await getDashboardStats(today, today);

  return <DashboardView initialData={initialData} />;
}
