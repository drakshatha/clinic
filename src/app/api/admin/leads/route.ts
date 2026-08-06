import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getAllLeads } from "@/lib/db";
import { formatIstDateTime, formatSlotLabel } from "@/lib/time";

export async function GET() {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await getAllLeads();
  const enriched = leads.map((l) => ({
    ...l,
    created_at_ist: formatIstDateTime(l.created_at),
    slot_label: formatSlotLabel(l.slot_date, l.slot_time),
    confirmed_at_ist: l.confirmed_at ? formatIstDateTime(l.confirmed_at) : null,
  }));

  return NextResponse.json({
    user: { name: session.name, role: session.role },
    leads: enriched,
  });
}
