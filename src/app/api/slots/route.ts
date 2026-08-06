import { NextResponse } from "next/server";
import { getSlotsForDate } from "@/lib/slots";
import { todayIst } from "@/lib/time";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || todayIst();
  try {
    const slots = await getSlotsForDate(date);
    const open = slots.filter((s) => s.available);
    return NextResponse.json({ date, slots, open, openCount: open.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid date" },
      { status: 400 }
    );
  }
}
