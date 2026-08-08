/**
 * GET    /api/admin/consent-forms/[id]            — full form including content
 * GET    /api/admin/consent-forms/[id]?format=pdf — printable HTML
 * PATCH  /api/admin/consent-forms/[id]            — save signature { signatureData }
 * DELETE /api/admin/consent-forms/[id]
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import * as fs from "fs";
import * as path from "path";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const form = await prisma.consentForm.findUnique({ where: { id } });
  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const wantPdf = req.nextUrl.searchParams.get("format") === "pdf";
  if (!wantPdf) return NextResponse.json(form);

  // ── Render printable consent form ─────────────────────────────────────────
  let logoSvg = "";
  try { logoSvg = fs.readFileSync(path.join(process.cwd(), "public", "images", "logo-akshatha.svg"), "utf-8"); } catch { /* ignore */ }

  const signatureHtml = form.signatureData
    ? `<div class="sig-block"><p class="sig-label">Patient Signature</p><img src="${form.signatureData}" class="sig-img" /><p class="sig-date">Signed: ${form.signedAt ? new Date(form.signedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</p></div>`
    : `<div class="sig-block unsigned"><p class="sig-label">Patient Signature</p><div class="sig-line"></div><p class="sig-date">Date: _______________</p></div>`;

  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${form.title} · ${site.name}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:system-ui,sans-serif;font-size:13px;color:#1a1a2e;background:#fff;padding:32px 40px 48px;max-width:800px;margin:0 auto}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #1a2357;margin-bottom:24px}
  .logo-wrap{max-width:180px}.logo-wrap svg{width:100%;height:auto}
  .clinic-name{font-size:20px;font-weight:700;color:#1a2357}
  .clinic-sub{font-size:11px;color:#666;margin-top:3px}
  .clinic-info{font-size:11px;color:#555;margin-top:6px;line-height:1.7}
  .consent-title{font-size:18px;font-weight:800;color:#1a2357;text-align:center;margin-bottom:20px;text-transform:uppercase;letter-spacing:.04em}
  .patient-strip{background:#f0f3ff;border-radius:8px;padding:12px 16px;margin-bottom:20px;display:flex;gap:40px;flex-wrap:wrap}
  .patient-strip .field label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#888;display:block;margin-bottom:2px}
  .patient-strip .field span{font-size:13px;font-weight:600;color:#1a2357}
  .content{line-height:1.8;color:#333;white-space:pre-wrap;margin-bottom:28px;font-size:13px}
  .sig-row{display:flex;gap:40px;justify-content:space-between;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:20px}
  .sig-block{flex:1}
  .sig-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#888;margin-bottom:8px}
  .sig-img{max-width:200px;max-height:80px;border-bottom:1px solid #333;display:block}
  .sig-line{width:100%;border-bottom:1px solid #999;height:80px;margin-bottom:4px}
  .sig-date{font-size:11px;color:#666;margin-top:6px}
  .unsigned .sig-line{border-color:#ccc}
  .print-btn{background:#1a2357;color:#fff;border:none;padding:9px 22px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:14px}
  @media print{.print-btn{display:none!important}}
</style></head><body>
<div style="text-align:right">
  <button class="print-btn" onclick="window.print()">🖨 Print</button>
</div>
<div class="header">
  <div>
    ${logoSvg ? `<div class="logo-wrap">${logoSvg}</div>` : `<div class="clinic-name">${site.name}</div>`}
    <div class="clinic-sub">${site.doctor} · ${site.credentials}</div>
    <div class="clinic-info">${site.address}<br>📞 ${site.phoneDisplay}</div>
  </div>
</div>
<div class="consent-title">${form.title}</div>
<div class="patient-strip">
  <div class="field"><label>Phone</label><span>${form.patientPhone}</span></div>
  <div class="field"><label>Date Issued</label><span>${new Date(form.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span></div>
</div>
<div class="content">${form.content}</div>
<div class="sig-row">
  ${signatureHtml}
  <div class="sig-block">
    <p class="sig-label">Doctor / Clinic Representative</p>
    <div class="sig-line"></div>
    <p class="sig-date">${site.doctor} · ${site.credentials}</p>
  </div>
</div>
</body></html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { signatureData } = await req.json();

  const form = await prisma.consentForm.update({
    where: { id },
    data: { signatureData, signedAt: new Date() },
  });

  return NextResponse.json({ ok: true, signedAt: form.signedAt });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.consentForm.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
