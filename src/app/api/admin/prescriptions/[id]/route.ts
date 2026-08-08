/**
 * GET /api/admin/prescriptions/[id]      — fetch one prescription (for PDF)
 * DELETE /api/admin/prescriptions/[id]   — delete prescription
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
  const wantPdf = req.nextUrl.searchParams.get("format") === "pdf";

  const rx = await prisma.prescription.findUnique({
    where: { id },
    include: { createdBy: { select: { name: true } } },
  });
  if (!rx) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!wantPdf) {
    return NextResponse.json({
      id: rx.id,
      patientPhone: rx.patientPhone,
      patientName: rx.patientName,
      chiefComplaint: rx.chiefComplaint,
      diagnosis: rx.diagnosis,
      medications: JSON.parse(rx.medications),
      advice: rx.advice,
      createdBy: rx.createdBy.name,
      createdAt: rx.createdAt,
    });
  }

  // ── Render printable HTML ─────────────────────────────────────────────────
  const meds: { drug: string; dosage: string; frequency: string; duration: string; instructions: string }[] =
    JSON.parse(rx.medications);

  const date = new Date(rx.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });

  // Inline the SVG logo (same approach as invoice)
  let logoSvg = "";
  try {
    logoSvg = fs.readFileSync(path.join(process.cwd(), "public", "images", "logo-akshatha.svg"), "utf-8");
  } catch { /* ignore */ }

  const medRows = meds.map((m, i) => `
    <tr>
      <td class="num">${i + 1}</td>
      <td>
        <span class="drug-name">${m.drug}</span>
        ${m.dosage ? `<span class="drug-dosage">${m.dosage}</span>` : ""}
      </td>
      <td>${m.frequency || "—"}</td>
      <td>${m.duration || "—"}</td>
      <td>${m.instructions || "—"}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Prescription · ${rx.patientName}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,sans-serif;font-size:13px;color:#1a1a2e;background:#fff;padding:32px 40px 48px;max-width:800px;margin:0 auto}

    /* ── Header ── */
    .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:3px solid #1a2357;margin-bottom:20px}
    .logo-wrap{max-width:200px}
    .logo-wrap svg{width:100%;height:auto;display:block}
    .clinic-name{font-size:20px;font-weight:700;color:#1a2357}
    .clinic-sub{font-size:11px;color:#666;margin-top:3px}
    .clinic-info{font-size:11px;color:#555;margin-top:6px;line-height:1.7}
    .rx-badge{text-align:right}
    .rx-badge .rx-symbol{font-size:40px;font-weight:900;color:#1a2357;line-height:1;font-style:italic}
    .rx-badge .rx-date{font-size:12px;color:#666;margin-top:4px}

    /* ── Patient strip ── */
    .patient-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:#f0f3ff;border-radius:8px;padding:12px 16px;margin-bottom:20px}
    .patient-strip .field label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#888;display:block;margin-bottom:2px}
    .patient-strip .field span{font-size:13px;font-weight:600;color:#1a2357}

    /* ── Chief complaint / Diagnosis ── */
    .clinical{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
    .clinical-box{background:#fff8f0;border-left:3px solid #f47b20;border-radius:0 6px 6px 0;padding:10px 14px}
    .clinical-box label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#888;display:block;margin-bottom:4px}
    .clinical-box p{font-size:13px;color:#1a2357;line-height:1.5}

    /* ── Medications table ── */
    .rx-label{font-size:26px;font-weight:900;color:#1a2357;font-style:italic;margin-bottom:10px}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    thead th{background:#1a2357;color:#fff;padding:9px 12px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
    thead th.num{width:32px;text-align:center}
    tbody tr{border-bottom:1px solid #eef0f8}
    tbody tr:nth-child(even){background:#f8f9ff}
    tbody td{padding:10px 12px;vertical-align:top;font-size:13px}
    tbody td.num{text-align:center;color:#888;font-size:11px}
    .drug-name{font-weight:700;color:#1a2357;display:block}
    .drug-dosage{font-size:11px;color:#666;display:block;margin-top:1px}

    /* ── Advice ── */
    .advice-box{background:#f0fff4;border-left:3px solid #16a34a;border-radius:0 6px 6px 0;padding:10px 14px;margin-bottom:24px}
    .advice-box label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#16a34a;display:block;margin-bottom:4px}
    .advice-box p{font-size:13px;color:#1a2357;line-height:1.5}

    /* ── Footer ── */
    .footer{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:8px}
    .footer-note{font-size:10px;color:#999;max-width:420px;line-height:1.5}
    .sig-area{text-align:right}
    .sig-line{width:160px;border-top:1px solid #999;margin:0 0 6px auto}
    .sig-name{font-size:12px;font-weight:700;color:#1a2357}
    .sig-cred{font-size:10px;color:#666;margin-top:1px}

    .print-btn{background:#1a2357;color:#fff;border:none;padding:9px 22px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:14px}
    @media print{.print-btn{display:none!important}.no-print{display:none!important}}
  </style>
</head>
<body>
<div class="no-print" style="text-align:right">
  <button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>
</div>

<div class="header">
  <div>
    ${logoSvg ? `<div class="logo-wrap">${logoSvg}</div>` : `<div class="clinic-name">${site.name}</div>`}
    <div class="clinic-sub">${site.doctor} · ${site.credentials}</div>
    <div class="clinic-info">${site.address}<br>📞 ${site.phoneDisplay} &nbsp;·&nbsp; ${site.email}</div>
  </div>
  <div class="rx-badge">
    <div class="rx-symbol">℞</div>
    <div class="rx-date">${date}</div>
  </div>
</div>

<div class="patient-strip">
  <div class="field"><label>Patient</label><span>${rx.patientName || "—"}</span></div>
  <div class="field"><label>Phone</label><span>${rx.patientPhone}</span></div>
  <div class="field"><label>Prescribed by</label><span>${rx.createdBy.name}</span></div>
</div>

${(rx.chiefComplaint || rx.diagnosis) ? `
<div class="clinical">
  ${rx.chiefComplaint ? `<div class="clinical-box"><label>Chief Complaint</label><p>${rx.chiefComplaint}</p></div>` : ""}
  ${rx.diagnosis ? `<div class="clinical-box"><label>Diagnosis</label><p>${rx.diagnosis}</p></div>` : ""}
</div>` : ""}

<div class="rx-label">℞</div>
<table>
  <thead>
    <tr>
      <th class="num">#</th>
      <th>Medicine</th>
      <th>Frequency</th>
      <th>Duration</th>
      <th>Instructions</th>
    </tr>
  </thead>
  <tbody>${medRows}</tbody>
</table>

${rx.advice ? `
<div class="advice-box">
  <label>General Advice</label>
  <p>${rx.advice}</p>
</div>` : ""}

<div class="footer">
  <div class="footer-note">
    This prescription is valid for 30 days from the date issued.<br>
    Please follow dosage as directed. Contact us if any adverse reaction occurs.
  </div>
  <div class="sig-area">
    <div class="sig-line"></div>
    <div class="sig-name">${rx.createdBy.name}</div>
    <div class="sig-cred">${site.credentials}</div>
  </div>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await requireStaff("complete_visits");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.prescription.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
