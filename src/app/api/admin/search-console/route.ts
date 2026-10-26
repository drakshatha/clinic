import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

const GSC_SITE = process.env.GOOGLE_SEARCH_CONSOLE_SITE ?? "sc-domain:drakshatha.in";

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claim = Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).toString("base64url");
  const unsigned = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  const sig = signer.sign(privateKey, "base64url");
  const jwt = `${unsigned}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(data.error_description ?? "token fetch failed");
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

  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw) return NextResponse.json({ configured: false });

  try {
    const sa = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    const token = await getAccessToken(sa.client_email, sa.private_key);
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
    console.error("[gsc]", err);
    return NextResponse.json({ error: "Failed to fetch GSC data" }, { status: 500 });
  }
}
