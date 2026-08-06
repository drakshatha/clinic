import type { MetadataRoute } from "next";
import { services, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/about`, priority: 0.8 },
    { url: `${base}/services`, priority: 0.9 },
    { url: `${base}/contact`, priority: 0.9 },
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      priority: 0.8,
    })),
  ];
}
