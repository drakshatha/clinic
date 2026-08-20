/**
 * Fetch live review count + rating from Google Places API.
 * - Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in env vars.
 * - Next.js caches the fetch for 6 hours (revalidate: 21600).
 * - Falls back to DB settings → site.ts if API is not configured.
 */
import { site } from "@/lib/site";

export type GoogleReviewData = {
  reviewCount: number;
  rating: string;
  source: "google" | "db" | "static";
};

export async function getGoogleReviews(): Promise<GoogleReviewData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (apiKey && placeId) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total&key=${apiKey}`;
      // Next.js caches this fetch for 6 hours — only calls Google once every 6h
      const res = await fetch(url, { next: { revalidate: 21600 } });
      const data = await res.json();

      if (data.status === "OK" && data.result) {
        return {
          reviewCount: data.result.user_ratings_total ?? site.reviewCount,
          rating: data.result.rating != null
            ? String(Number(data.result.rating).toFixed(1))
            : site.rating,
          source: "google",
        };
      }
      console.warn("[google-reviews] API returned status:", data.status, data.error_message);
    } catch (err) {
      console.warn("[google-reviews] fetch failed:", err);
    }
  }

  // Fallback: DB settings (manually updated by admin)
  try {
    const { getSiteStats } = await import("@/lib/site-settings");
    const stats = await getSiteStats();
    return { reviewCount: stats.reviewCount, rating: stats.rating, source: "db" };
  } catch {
    return { reviewCount: site.reviewCount, rating: site.rating, source: "static" };
  }
}
