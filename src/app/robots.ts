import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block all admin, patient, and edit areas from indexing
        disallow: [
          "/admin/",
          "/admin",
          "/patient/",
          "/patient",
          "/edit/",
          "/edit",
          "/api/",
          "/api",
        ],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
