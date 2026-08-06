import { redirect, notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { getLeadForInvoice } from "@/lib/db";
import { site } from "@/lib/site";
import { formatSlotLabel, formatIstDateTime } from "@/lib/time";
import { InvoiceActions } from "@/components/admin/InvoiceActions";

export const metadata = {
  title: "Invoice – Admin",
  robots: { index: false, follow: false },
};

type Ctx = { params: Promise<{ id: string }> };

const VISIT_LABELS: Record<string, string> = {
  consultation: "Initial Consultation",
  treatment:    "Treatment Session",
  followup:     "Follow-up Visit",
  resolved:     "Case Resolved",
};

const PAYMENT_LABELS: Record<string, string> = {
  cash:    "Cash",
  upi:     "UPI / GPay / PhonePe",
  card:    "Card",
  online:  "Online Transfer",
  waived:  "Complimentary",
  pending: "Payment Pending",
};

export default async function InvoicePage({ params }: Ctx) {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");

  const { id } = await params;
  const lead = await getLeadForInvoice(id);
  if (!lead) notFound();

  const c = lead.consultation;
  const invoiceNum = `INV-${id.slice(-8).toUpperCase()}`;
  const visitDate = formatSlotLabel(lead.slotDate, lead.slotTime);
  const recordedAt = c?.completedAt ? formatIstDateTime(c.completedAt.toISOString()) : null;

  // WhatsApp message text
  const whatsappText = encodeURIComponent(
    `*${site.name}*\n` +
    `Invoice No: ${invoiceNum}\n\n` +
    `Patient: ${lead.name}\n` +
    `Date: ${visitDate}\n` +
    (c?.visitType ? `Visit: ${VISIT_LABELS[c.visitType] ?? c.visitType}\n` : "") +
    (c?.treatmentDone ? `Treatment: ${c.treatmentDone}\n` : "") +
    (c?.paymentAmount ? `Amount: ₹${c.paymentAmount.toLocaleString("en-IN")}\n` : "") +
    (c?.paymentMode ? `Mode: ${PAYMENT_LABELS[c.paymentMode] ?? c.paymentMode}\n` : "") +
    (c?.transactionId ? `Transaction ID: ${c.transactionId}\n` : "") +
    `\n${site.name} | ${site.phoneDisplay}`
  );
  const whatsappUrl = `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${whatsappText}`;

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4">
      {/* Action bar */}
      <div className="mx-auto max-w-2xl mb-4">
        <InvoiceActions whatsappUrl={whatsappUrl} />
      </div>

      {/* Printable invoice */}
      <div id="invoice" className="mx-auto max-w-2xl bg-white rounded-2xl shadow-[var(--shadow)] overflow-hidden print:shadow-none print:rounded-none">

        {/* Header */}
        <div className="bg-navy px-8 py-7 text-white print:bg-navy">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-white/60 mb-1">Receipt / Invoice</p>
              <h1 className="text-2xl font-extrabold tracking-tight">{site.name}</h1>
              <p className="text-sm text-white/70 mt-0.5">{site.doctor} · {site.credentials}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[11px] text-white/60 font-bold tracking-widest uppercase">Invoice No.</p>
              <p className="text-lg font-bold font-mono mt-0.5">{invoiceNum}</p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/10 text-xs text-white/60 flex flex-wrap gap-x-6 gap-y-1">
            <span>📍 {site.address}</span>
            <span>📞 {site.phoneDisplay}</span>
            <span>✉️ {site.email}</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7">

          {/* Patient + visit info */}
          <div className="grid sm:grid-cols-2 gap-6 mb-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Patient</p>
              <p className="text-lg font-bold text-navy">{lead.name}</p>
              <p className="text-sm text-muted mt-0.5">{lead.phone}</p>
              {lead.email && <p className="text-sm text-muted">{lead.email}</p>}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Appointment</p>
              <p className="text-sm font-semibold text-navy">{visitDate}</p>
              {c?.visitType && (
                <p className="text-xs text-muted mt-0.5">{VISIT_LABELS[c.visitType] ?? c.visitType}</p>
              )}
              {recordedAt && (
                <p className="text-xs text-muted mt-0.5">Recorded: {recordedAt}</p>
              )}
            </div>
          </div>

          {/* Treatment row */}
          {c?.treatmentDone && (
            <div className="rounded-xl bg-[#F5F7FB] px-5 py-4 mb-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Treatment / Services</p>
              <p className="text-sm text-navy font-medium">{c.treatmentDone}</p>
              {c.notes && (
                <p className="text-xs text-muted mt-2 leading-relaxed">{c.notes}</p>
              )}
            </div>
          )}

          {/* Follow-up notice */}
          {c?.nextVisitDate && (
            <div className="rounded-xl bg-purple-50 border border-purple-100 px-5 py-3 mb-6 flex items-center gap-3">
              <span className="text-xl">🔁</span>
              <div>
                <p className="text-xs font-bold text-purple-900">Next Visit Scheduled</p>
                <p className="text-sm text-purple-800">{c.nextVisitDate}</p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="border-t border-line pt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Payment</p>
            </div>
            <div className="flex flex-col gap-2">
              {c?.paymentAmount ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Amount</span>
                  <span className="text-2xl font-extrabold text-navy">
                    ₹{c.paymentAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Amount</span>
                  <span className="text-sm text-muted italic">Not recorded</span>
                </div>
              )}
              {c?.paymentMode && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Payment Mode</span>
                  <span className="text-sm font-semibold text-navy">
                    {PAYMENT_LABELS[c.paymentMode] ?? c.paymentMode}
                  </span>
                </div>
              )}
              {c?.transactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Transaction / UTR ID</span>
                  <span className="text-sm font-mono font-semibold text-navy">{c.transactionId}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-line">
                <span className="text-sm text-muted">Status</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  c?.paymentMode === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : c?.paymentMode === "waived"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-green-100 text-green-800"
                }`}>
                  {c?.paymentMode === "pending" ? "Pending" : c?.paymentMode === "waived" ? "Waived" : "Paid"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F5F7FB] px-8 py-4 border-t border-line">
          <p className="text-xs text-muted text-center">
            Thank you for choosing {site.name} · {site.hours} · {site.phoneDisplay}
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          #invoice { box-shadow: none; }
          .bg-navy { background-color: #1A2744 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
