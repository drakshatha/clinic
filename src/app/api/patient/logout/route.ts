import { NextRequest, NextResponse } from "next/server";
import { deletePatientSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("akshatha_patient_session")?.value;
  if (token) await deletePatientSession(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("akshatha_patient_session", "", { expires: new Date(0), path: "/" });
  return res;
}
