import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { site } from "@/lib/site";

const BASE = site.url;

async function checkUrl(url: string): Promise<{ ok: boolean; status: number; redirect?: string }> {
  try {
    const res = await fetch(url, { redirect: "manual", next: { revalidate: 0 } });
    return {
      ok: res.status === 200,
      status: res.status,
      redirect: res.headers.get("location") ?? undefined,
    };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function fetchText(url: string): Promise<string> {
  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    return res.ok ? res.text() : "";
  } catch {
    return "";
  }
}

export async function GET() {
  const session = await requireStaff("view_leads");
  if (!session?.isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const PAGES = [
    { path: "/", label: "Homepage", priority: "critical" },
    { path: "/services/dental-implants", label: "Dental Implants", priority: "high" },
    { path: "/dental-implant-cost-bangalore", label: "Implant Cost Page", priority: "high" },
    { path: "/services/full-mouth-rehabilitation", label: "Full Mouth Rehab", priority: "high" },
    { path: "/contact", label: "Contact", priority: "high" },
    { path: "/gallery", label: "Gallery", priority: "medium" },
    { path: "/about", label: "About", priority: "medium" },
    { path: "/privacy", label: "Privacy Policy", priority: "low" },
    { path: "/sitemap.xml", label: "Sitemap", priority: "critical" },
    { path: "/robots.txt", label: "Robots.txt", priority: "critical" },
  ];

  const [pageResults, robotsTxt, sitemapXml] = await Promise.all([
    Promise.all(PAGES.map(async (p) => ({ ...p, ...(await checkUrl(`${BASE}${p.path}`)) }))),
    fetchText(`${BASE}/robots.txt`),
    fetchText(`${BASE}/sitemap.xml`),
  ]);

  // Parse sitemap URLs
  const sitemapUrls = (sitemapXml.match(/<loc>(.*?)<\/loc>/g) ?? [])
    .map((s) => s.replace(/<\/?loc>/g, "").trim());

  // Robots checks
  const robotsChecks = {
    exists: robotsTxt.length > 0,
    blocksAdmin: robotsTxt.includes("Disallow: /admin"),
    blocksApi: robotsTxt.includes("Disallow: /api"),
    hasSitemap: robotsTxt.includes("Sitemap:"),
    allowsGooglebot: !robotsTxt.includes("User-agent: Googlebot\nDisallow: /"),
    hasAiCrawlerRules: robotsTxt.includes("GPTBot") || robotsTxt.includes("OAI-SearchBot"),
  };

  // Sitemap checks
  const importantPaths = [
    "/dental-implant-cost-bangalore",
    "/services/dental-implants",
    "/",
    "/contact",
  ];
  const sitemapChecks = importantPaths.map((path) => ({
    path,
    inSitemap: sitemapUrls.some((u) => u === `${BASE}${path}` || u === `${BASE}${path}/`),
  }));

  // Score calculation
  const pageScore = pageResults.filter((p) => p.ok).length / pageResults.length;
  const robotsScore = Object.values(robotsChecks).filter(Boolean).length / Object.keys(robotsChecks).length;
  const sitemapScore = sitemapChecks.filter((c) => c.inSitemap).length / sitemapChecks.length;
  const overallScore = Math.round(((pageScore * 0.4) + (robotsScore * 0.3) + (sitemapScore * 0.3)) * 100);

  return NextResponse.json({
    score: overallScore,
    checkedAt: new Date().toISOString(),
    pages: pageResults,
    robots: { raw: robotsTxt, checks: robotsChecks },
    sitemap: { totalUrls: sitemapUrls.length, checks: sitemapChecks },
  });
}
