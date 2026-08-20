import { NextRequest, NextResponse } from "next/server";
import { isSiteEditor } from "@/lib/edit-auth";
import { prisma } from "@/lib/prisma";

async function guard() {
  if (!(await isSiteEditor()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const err = await guard(); if (err) return err;
  const rows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const body: Record<string, string> = await req.json();
  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
