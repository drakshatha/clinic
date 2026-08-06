import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getAllStaff, createStaff } from "@/lib/db";

export async function GET() {
  const session = await requireStaff(["doctor"]);
  if (!session) return NextResponse.json({ error: "Doctor access required" }, { status: 403 });

  const staff = await getAllStaff();
  return NextResponse.json({
    staff: staff.map((s) => ({
      id: s.id,
      name: s.name,
      username: s.username,
      role: s.role,
      createdAt: s.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireStaff(["doctor"]);
  if (!session) return NextResponse.json({ error: "Doctor access required" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "").trim();
  const role = String(body.role || "assistant").trim();

  if (!name || !username || !password) {
    return NextResponse.json({ error: "name, username and password required" }, { status: 400 });
  }
  if (!["doctor", "assistant"].includes(role)) {
    return NextResponse.json({ error: "role must be doctor or assistant" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  try {
    const staff = await createStaff({ name, username, password, role });
    return NextResponse.json({ ok: true, staff: { id: staff.id, name: staff.name, username: staff.username, role: staff.role } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Unique constraint") || msg.includes("unique")) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}
