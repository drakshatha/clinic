/** GET /api/public/gallery — public before/after gallery cases */
import { NextResponse } from "next/server";
import { getAllGallery } from "@/lib/db";

export const revalidate = 300; // 5-minute ISR

export async function GET() {
  const cases = await getAllGallery(true); // public only
  return NextResponse.json(cases);
}
