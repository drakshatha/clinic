import { NextResponse } from "next/server";
import { isSiteEditor } from "@/lib/edit-auth";

export async function GET() {
  if (!(await isSiteEditor()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey) return NextResponse.json({ ok: false, error: "GOOGLE_PLACES_API_KEY is not set in environment variables." });
  if (!placeId) return NextResponse.json({ ok: false, error: "GOOGLE_PLACE_ID is not set in environment variables." });

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,user_ratings_total&key=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json({
        ok: false,
        error: `Google API returned: ${data.status}${data.error_message ? " — " + data.error_message : ""}`,
      });
    }
    return NextResponse.json({
      ok: true,
      businessName: data.result.name,
      reviewCount: data.result.user_ratings_total,
      rating: data.result.rating,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) });
  }
}
