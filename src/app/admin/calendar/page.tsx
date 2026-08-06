import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { CalendarView } from "@/components/admin/CalendarView";

export const metadata = {
  title: "Calendar – Admin",
  robots: { index: false, follow: false },
};

export default async function CalendarPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  return (
    <div className="mx-auto w-[min(900px,100%)]">
      <CalendarView />
    </div>
  );
}
