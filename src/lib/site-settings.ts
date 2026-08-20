/**
 * Server-side helper: fetch editable site stats from DB.
 * Falls back to site.ts values if DB is unreachable or setting not yet saved.
 */
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

export type SiteStats = {
  reviewCount: number;
  rating: string;
  yearsExperience: number;
  patientsServed: string;
};

export async function getSiteStats(): Promise<SiteStats> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ["review_count", "review_rating", "years_experience", "patients_served"] } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      reviewCount:     parseInt(map["review_count"]   ?? String(site.reviewCount), 10),
      rating:          map["review_rating"]            ?? site.rating,
      yearsExperience: parseInt(map["years_experience"] ?? String(site.yearsExperience), 10),
      patientsServed:  map["patients_served"]          ?? site.patientsServed,
    };
  } catch {
    return {
      reviewCount: site.reviewCount,
      rating: site.rating,
      yearsExperience: site.yearsExperience,
      patientsServed: site.patientsServed,
    };
  }
}
