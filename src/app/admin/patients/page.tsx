import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { getAllPatients } from "@/lib/db";
import { PatientsManager } from "@/components/admin/PatientsManager";

export const metadata = {
  title: "Patients – Admin",
  robots: { index: false, follow: false },
};

export default async function PatientsPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");

  // Pre-fetch on the server — the component renders instantly with no loading spinner.
  // Serialise Date fields to strings so they survive the server→client boundary.
  const rows = await getAllPatients();
  // Explicitly pick only the fields the component needs — avoids passing
  // non-serialisable Date objects (e.g. lastRecallAt) across the server→client boundary.
  const initialPatients = rows.map((p) => ({
    id:           p.id,
    phone:        p.phone,
    name:         p.name,
    email:        p.email,
    dob:          p.dob ?? null,
    lastSeen:     p.lastSeen.toISOString(),
    leads:        p.leads.map((l) => ({ id: l.id, status: l.status, slotDate: l.slotDate, treatment: l.treatment })),
    consultations: p.consultations.map((c) => ({ id: c.id, paymentAmount: c.paymentAmount, visitType: c.visitType })),
  }));

  return <PatientsManager initialPatients={initialPatients} />;
}
