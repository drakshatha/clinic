"use client";

import { useEffect, useState } from "react";
import { paymentReminderMessage, waLink, normalizePhone } from "@/lib/whatsapp";
import { formatSlotLabel } from "@/lib/time";

type OutstandingItem = {
  id: string;
  patientPhone: string;
  treatmentDone: string;
  paymentMode: string | null;
  paymentAmount: number | null;
  completedAt: string;
  lead: {
    id: string;
    name: string;
    phone: string;
    treatment: string;
    slotDate: string;
    slotTime: string;
  };
};

export function PaymentsTracker() {
  const [items, setItems] = useState<OutstandingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  const totalOutstanding = items.reduce((s, i) => s + (i.paymentAmount ?? 0), 0);

  if (loading) return <div className="py-12 text-center text-muted">Loading…</div>;

  return (
    <div className="space-y-6">
      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding" value={items.length.toString()} sub="consultations" />
        <StatCard
          label="Pending Amount"
          value={totalOutstanding > 0 ? `₹${totalOutstanding.toLocaleString("en-IN")}` : "—"}
          sub="total unpaid"
        />
        <StatCard label="Patients" value={new Set(items.map((i) => i.lead.phone)).size.toString()} sub="unique" />
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-semibold text-navy">All payments are recorded!</p>
          <p className="text-sm text-muted mt-1">No outstanding or missing payment entries.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center gap-3">
            <span className="text-lg">💰</span>
            <h2 className="font-semibold text-navy">Outstanding Payments</h2>
            <span className="ml-auto text-xs font-bold bg-red-50 text-red-600 rounded-full px-2 py-0.5">
              {items.length} pending
            </span>
          </div>
          <div className="divide-y divide-line">
            {items.map((item) => (
              <PaymentRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentRow({ item }: { item: OutstandingItem }) {
  const msg = paymentReminderMessage(item.lead.name, item.paymentAmount);
  const phone = normalizePhone(item.lead.phone);
  const waHref = waLink(phone, msg);
  const visitDate = new Date(item.completedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-navy">{item.lead.name}</span>
          <span className="text-xs text-muted">{item.lead.phone}</span>
          {item.paymentAmount ? (
            <span className="text-xs font-bold bg-red-50 text-red-600 rounded-full px-2 py-0.5">
              ₹{item.paymentAmount.toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-xs font-bold bg-amber-50 text-amber-700 rounded-full px-2 py-0.5">
              No amount recorded
            </span>
          )}
        </div>
        <p className="text-xs text-muted mt-1">
          {item.treatmentDone || item.lead.treatment || "Consultation"} · Visited {visitDate}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={`tel:${item.lead.phone}`}
          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-navy hover:bg-bg-soft transition"
        >
          📞 Call
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition"
        >
          💬 Remind
        </a>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}
