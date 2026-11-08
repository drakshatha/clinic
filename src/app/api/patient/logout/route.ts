import { NextRequest, NextResponse } from "next/server";
import { deletePatientSession } from "@/lib/db";

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return req.cookies.get("akshatha_patient_session")?.value ?? null;
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (token) await deletePatientSession(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("akshatha_patient_session", "", { expires: new Date(0), path: "/" });
  return res;
}
