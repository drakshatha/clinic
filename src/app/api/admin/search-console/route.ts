import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const GSC_SITE = process.env.GOOGLE_SEARCH_CONSOLE_SITE ?? "sc-domain:drakshatha.in";

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     process.env.GSC_CLIENT_ID!,
      client_secret: process.env.GSC_CLIENT_SECRET!,
      refresh_token: process.env.GSC_REFRESH_TOKEN!,
      grant_type:    "refresh_token",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`OAuth error: ${data.error} — ${data.error_description}`);
  return data.access_token as string;
}

async function gscQuery(token: string, body: object) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function dateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

export async function GET() {
  const session = await getSession();
  if (!session?.isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const configured = !!(process.env.GSC_CLIENT_ID && process.env.GSC_CLIENT_SECRET && process.env.GSC_REFRESH_TOKEN);
  if (!configured) return NextResponse.json({ configured: false });

  try {
    const token = await getAccessToken();
    const range = { startDate: dateStr(28), endDate: dateStr(1) };

    const [totalData, queriesData, pagesData] = await Promise.all([
      gscQuery(token, { ...range, rowLimit: 1 }),
      gscQuery(token, { ...range, dimensions: ["query"], rowLimit: 10 }),
      gscQuery(token, { ...range, dimensions: ["page"], rowLimit: 10 }),
    ]);

    const total = totalData.rows?.[0];

    return NextResponse.json({
      configured: true,
      period: `${range.startDate} → ${range.endDate}`,
      overview: {
        clicks:      total?.clicks      ?? 0,
        impressions: total?.impressions ?? 0,
        ctr:         total ? Math.round(total.ctr * 1000) / 10 : 0,
        position:    total ? Math.round(total.position * 10) / 10 : 0,
      },
      queries: (queriesData.rows ?? []).map((r: {
        keys: string[]; clicks: number; impressions: number; position: number;
      }) => ({
        query:       r.keys[0],
        clicks:      r.clicks,
        impressions: r.impressions,
        position:    Math.round(r.position * 10) / 10,
      })),
      pages: (pagesData.rows ?? []).map((r: {
        keys: string[]; clicks: number; impressions: number;
      }) => ({
        page:        r.keys[0].replace("https://drakshatha.in", "") || "/",
        clicks:      r.clicks,
        impressions: r.impressions,
      })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[gsc]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
