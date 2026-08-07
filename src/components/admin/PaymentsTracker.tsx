"use client";

import { useEffect, useState } from "react";
import { paymentReminderMessage, waLink, normalizePhone } from "@/lib/whatsapp";

type OutstandingItem = {
  id: string;           // consultationId
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

const MODES = [
  { value: "cash",    label: "💵 Cash" },
  { value: "upi",     label: "📱 UPI" },
  { value: "card",    label: "💳 Card" },
  { value: "waived",  label: "🤝 Waived" },
];

export function PaymentsTracker() {
  const [items, setItems]     = useState<OutstandingItem[]>([]);
  const [loading, setLoading] = useState(true);
  /** which consultation row is expanded for payment entry */
  const [recording, setRecording] = useState<string | null>(null);
  const [form, setForm] = useState<{ mode: string; amount: string; txn: string }>({
    mode: "cash", amount: "", txn: "",
  });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/payments");
    const d = await r.json();
    setItems(d.items ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openRecord(id: string, existingAmount?: number | null) {
    setRecording(id);
    setForm({ mode: "cash", amount: existingAmount ? String(existingAmount) : "", txn: "" });
  }

  async function savePayment(consultationId: string) {
    setSaving(true);
    await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consultationId,
        paymentMode: form.mode,
        paymentAmount: form.amount ? Number(form.amount) : null,
        transactionId: form.txn || null,
      }),
    });
    setSaving(false);
    setRecording(null);
    load();
  }

  const totalOutstanding = items.reduce((s, i) => s + (i.paymentAmount ?? 0), 0);
  const uniquePatients   = new Set(items.map((i) => i.lead.phone)).size;

  if (loading) return <div className="py-12 text-center text-muted">Loading…</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding"    value={items.length.toString()}                                                                 sub="consultations" />
        <StatCard label="Pending Amount" value={totalOutstanding > 0 ? `₹${totalOutstanding.toLocaleString("en-IN")}` : "—"}            sub="total unpaid" />
        <StatCard label="Patients"       value={uniquePatients.toString()}                                                               sub="unique" />
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
              <div key={item.id}>
                <PaymentRow
                  item={item}
                  onRecord={() => openRecord(item.id, item.paymentAmount)}
                  isRecording={recording === item.id}
                />

                {/* Inline record-payment form */}
                {recording === item.id && (
                  <div className="bg-blue/5 border-t border-line px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted mb-3">
                      Record Payment — {item.lead.name}
                    </p>
                    <div className="flex flex-wrap items-end gap-3">
                      {/* Mode */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-muted font-semibold uppercase tracking-wide">Mode</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {MODES.map((m) => (
                            <button
                              key={m.value}
                              onClick={() => setForm((f) => ({ ...f, mode: m.value }))}
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                                form.mode === m.value
                                  ? "bg-blue text-white border-blue"
                                  : "border-line text-navy bg-white hover:border-blue/40"
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Amount */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-muted font-semibold uppercase tracking-wide">Amount (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 1500"
                          value={form.amount}
                          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                          className="rounded-xl border border-line px-3 py-2 text-sm text-navy w-32 focus:outline-none focus:ring-2 focus:ring-blue/30"
                        />
                      </div>
                      {/* UPI/Card transaction ref */}
                      {(form.mode === "upi" || form.mode === "card" || form.mode === "online") && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] text-muted font-semibold uppercase tracking-wide">Txn Ref</label>
                          <input
                            type="text"
                            placeholder="Optional reference"
                            value={form.txn}
                            onChange={(e) => setForm((f) => ({ ...f, txn: e.target.value }))}
                            className="rounded-xl border border-line px-3 py-2 text-sm text-navy w-40 focus:outline-none focus:ring-2 focus:ring-blue/30"
                          />
                        </div>
                      )}
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => savePayment(item.id)}
                          disabled={saving || !form.mode}
                          className="rounded-xl bg-blue px-4 py-2 text-sm font-bold text-white hover:bg-blue-deep transition-colors disabled:opacity-50"
                        >
                          {saving ? "Saving…" : "✓ Save"}
                        </button>
                        <button
                          onClick={() => setRecording(null)}
                          className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-bg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentRow({
  item,
  onRecord,
  isRecording,
}: {
  item: OutstandingItem;
  onRecord: () => void;
  isRecording: boolean;
}) {
  const msg    = paymentReminderMessage(item.lead.name, item.paymentAmount);
  const phone  = normalizePhone(item.lead.phone);
  const waHref = waLink(phone, msg);
  const visitDate = new Date(item.completedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
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
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <button
          onClick={onRecord}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            isRecording
              ? "bg-blue text-white"
              : "border border-blue/30 bg-blue/5 text-blue hover:bg-blue hover:text-white"
          }`}
        >
          {isRecording ? "▲ Recording" : "✏️ Record"}
        </button>
        <a
          href={`/api/admin/invoice/${item.lead.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-navy hover:bg-bg transition"
        >
          🧾 Invoice
        </a>
        <a
          href={`tel:${item.lead.phone}`}
          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-navy hover:bg-bg transition"
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
