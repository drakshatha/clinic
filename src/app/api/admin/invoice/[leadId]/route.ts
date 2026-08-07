/**
 * GET /api/admin/invoice/[leadId]
 *
 * Returns an HTML page (print-to-PDF) with GST invoice details.
 * Open in new tab and use browser Print → Save as PDF.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getLeadForInvoice } from "@/lib/db";
import { site } from "@/lib/site";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
  const session = await requireStaff("view_leads");
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { leadId } = await params;
  const lead = await getLeadForInvoice(leadId);
  if (!lead) return new NextResponse("Not found", { status: 404 });

  const c = lead.consultation;
  const invoiceNo = `INV-${lead.id.slice(-8).toUpperCase()}`;
  const amount = c?.paymentAmount ?? 0;
  const date = c?.completedAt
    ? new Date(c.completedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Invoice ${invoiceNo}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,sans-serif;font-size:14px;color:#1a1a2e;background:#fff;padding:40px;max-width:800px;margin:0 auto}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #1a2357}
    .clinic-name{font-size:22px;font-weight:700;color:#1a2357}
    .clinic-sub{font-size:12px;color:#666;margin-top:4px}
    .clinic-info{font-size:12px;color:#555;margin-top:8px;line-height:1.7}
    .invoice-badge{text-align:right}
    .invoice-badge h2{font-size:28px;font-weight:700;color:#1a2357}
    .inv-no{font-size:13px;color:#666;margin-top:4px}
    .inv-date{font-size:13px;color:#555}
    .parties{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px}
    .party h3{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#888;margin-bottom:8px}
    .party .name{font-size:15px;font-weight:600}
    .party .detail{font-size:13px;color:#555;margin-top:4px;line-height:1.7}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    thead th{background:#1a2357;color:#fff;padding:12px 16px;text-align:left;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
    thead th:last-child{text-align:right}
    tbody td{padding:14px 16px;border-bottom:1px solid #f0f0f0;font-size:14px}
    tbody td:last-child{text-align:right;font-weight:500}
    .totals{margin-left:auto;width:280px}
    .total-row{display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#555}
    .total-row.grand{border-top:2px solid #1a2357;margin-top:8px;padding-top:12px;font-size:17px;font-weight:700;color:#1a2357}
    .note-box{background:#f8f9ff;border-left:4px solid #1a2357;padding:16px 20px;margin:28px 0;border-radius:4px}
    .note-box p{font-size:12px;color:#555;line-height:1.7}
    .footer{margin-top:48px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:flex-end}
    .sig-line{text-align:right}
    .sig-line .line{width:160px;border-top:1px solid #999;margin-bottom:8px;margin-left:auto}
    .sig-line p{font-size:12px;color:#666}
    .paid-pill{display:inline-block;background:#d1fae5;color:#065f46;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:600}
    .print-btn{background:#1a2357;color:#fff;border:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:16px}
    @media print{.print-btn{display:none!important}}
  </style>
</head>
<body>
<div style="text-align:right">
  <button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>
</div>

<div class="header">
  <div>
    <div class="clinic-name">${site.name}</div>
    <div class="clinic-sub">${site.doctor} · ${site.credentials}</div>
    <div class="clinic-info">
      ${site.address}<br>
      📞 ${site.phoneDisplay} &nbsp;·&nbsp; ${site.email}
    </div>
  </div>
  <div class="invoice-badge">
    <h2>INVOICE</h2>
    <div class="inv-no">${invoiceNo}</div>
    <div class="inv-date">Date: ${date}</div>
  </div>
</div>

<div class="parties">
  <div class="party">
    <h3>Bill To</h3>
    <div class="name">${lead.name}</div>
    <div class="detail">
      📞 ${lead.phone}${lead.email ? `<br>✉ ${lead.email}` : ""}
    </div>
  </div>
  <div class="party">
    <h3>Appointment</h3>
    <div class="detail">
      📅 ${lead.slotDate} at ${lead.slotTime}<br>
      ${lead.treatment ? `🦷 ${lead.treatment}` : ""}
      ${c?.visitType ? `<br>Visit type: ${c.visitType}` : ""}
    </div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>#</th><th>Description</th><th>Amount (₹)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>
        <strong>${c?.treatmentDone || lead.treatment || "Dental Consultation"}</strong>
        ${c?.notes ? `<br><span style="font-size:12px;color:#666">${c.notes}</span>` : ""}
      </td>
      <td>₹${amount.toLocaleString("en-IN")}</td>
    </tr>
  </tbody>
</table>

<div class="totals">
  <div class="total-row"><span>Subtotal</span><span>₹${amount.toLocaleString("en-IN")}</span></div>
  <div class="total-row"><span>GST (Exempt – SAC 9993)</span><span>₹0</span></div>
  <div class="total-row grand"><span>Total</span><span>₹${amount.toLocaleString("en-IN")}</span></div>
</div>

${c?.paymentMode ? `
<div style="margin-top:20px;text-align:right">
  <span class="paid-pill">✓ Paid via ${c.paymentMode.toUpperCase()}${c.transactionId ? ` · Ref: ${c.transactionId}` : ""}</span>
</div>
` : ""}

<div class="note-box">
  <p>
    <strong>Note:</strong> Healthcare and dental services are exempt from GST under the Indian GST Act (SAC code 9993).
    This invoice is a valid proof of payment for insurance claims and tax records.
    Please retain for your records.
  </p>
</div>

<div class="footer">
  <div>
    <div style="font-size:16px;font-weight:600;color:#1a2357">Thank you for trusting us with your smile! 🦷</div>
    <div style="font-size:12px;color:#888;margin-top:4px">${site.url}</div>
  </div>
  <div class="sig-line">
    <div class="line"></div>
    <p>Authorised Signature</p>
    <p style="margin-top:2px;font-weight:600">${site.doctor}</p>
  </div>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
