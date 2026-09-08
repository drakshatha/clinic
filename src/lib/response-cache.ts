/**
 * Adds Cache-Control headers to a NextResponse for read-only admin API routes.
 *
 * private        — only the user's browser caches it (not Vercel CDN / proxies)
 * max-age=30     — serve from cache for 30 s without hitting the server at all
 * stale-while-revalidate=60 — after 30 s, serve stale instantly while fetching
 *                             fresh data in the background (user sees no wait)
 *
 * Effect: clicking between admin tabs within 30 s is instant; after that
 * the old data appears immediately and the new data arrives silently.
 */
import { NextResponse } from "next/server";

export function withCache<T>(data: T, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(data, init);
  res.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60");
  return res;
}
