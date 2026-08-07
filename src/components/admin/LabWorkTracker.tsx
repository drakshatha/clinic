"use client";

import { useState, useEffect } from "react";

type LabWork = {
  id: string;
  leadId: string;
  patientPhone: string;
  patientName: string;
  labName: string;
  workType: string;
  description: string;
  sentDate: string;
  expectedDate: string | null;
  receivedDate: string | null;
  status: string;
  notes: string;
  createdAt: string;
  lead: { name: string; phone: string; treatment: string };
};

type Lead = { id: string; name: string; phone: string; treatment: string };

const STATUS_COLORS: Record<string, string> = {
  sent: "bg-blue-100 text-blue-800",
  received: "bg-yellow-100 text-yellow-800",
  fitted: "bg-green-100 text-green-800",
};

const WORK_TYPES = ["crown", "bridge", "denture", "implant-crown", "other"];
const TODAY = new Date().toISOString().split("T")[0];

export function LabWorkTracker() {
  const [items, setItems] = useState<LabWork[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const [form, setForm] = useState({
    leadId: "",
    labName: "",
    workType: "crown",
    description: "",
    sentDate: TODAY,
    expectedDate: "",
    notes: "",
  });

  const [statusForms, setStatusForms] = useState<Record<string, { status: string; receivedDate: string; notes: string }>>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [labRes, leadsRes] = await Promise.all([
      fetch("/api/admin/lab-work"),
      fetch("/api/admin/leads"),
    ]);
    if (labRes.ok) setItems(await labRes.json());
    if (leadsRes.ok) {
      const data = await leadsRes.json();
      setLeads((data.leads ?? []).filter((l: Lead & { status: string }) =>
        ["confirmed", "completed"].includes(l.status)
      ).map((l: Lead) => ({ id: l.id, name: l.name, phone: l.phone, treatment: l.treatment })));
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const lead = leads.find((l) => l.id === form.leadId);
    if (!lead) return;
    const res = await fetch("/api/admin/lab-work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        patientPhone: lead.phone,
        patientName: lead.name,
      }),
    });
    if (res.ok) {
      const item = await res.json();
      setItems((prev) => [item, ...prev]);
      setCreating(false);
      setForm({ leadId: "", labName: "", workType: "crown", description: "", sentDate: TODAY, expectedDate: "", notes: "" });
    }
  }

  function initStatusForm(item: LabWork) {
    setStatusForms((prev) => ({
      ...prev,
      [item.id]: { status: item.status, receivedDate: item.receivedDate ?? "", notes: item.notes },
    }));
    setUpdating(item.id);
  }

  async function handleUpdate(id: string) {
    const sf = statusForms[id];
    if (!sf) return;
    const res = await fetch("/api/admin/lab-work", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...sf }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updated } : i)));
      setUpdating(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this lab work entry?")) return;
    const res = await fetch(`/api/admin/lab-work?id=${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const pending = items.filter((i) => i.status === "sent");
  const received = items.filter((i) => i.status === "received");
  const fitted = items.filter((i) => i.status === "fitted");

  function daysUntil(date: string | null) {
    if (!date) return null;
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    return diff;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">🔬 Lab Work Tracker</h2>
          <p className="text-sm text-muted mt-1">Track crowns, bridges, dentures and implant orders sent to dental labs.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="rounded-xl bg-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
        >
          + New Entry
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending at Lab", value: pending.length, color: "text-blue-600" },
          { label: "Received", value: received.length, color: "text-yellow-600" },
          { label: "Fitted", value: fitted.length, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-4 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {creating && (
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="text-lg font-bold text-navy mb-4">New Lab Work Entry</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Patient Appointment</label>
                <select
                  value={form.leadId}
                  onChange={(e) => setForm((f) => ({ ...f, leadId: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue/30"
                >
                  <option value="">Select appointment...</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.name} · {l.treatment || "No treatment"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Lab Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore Dental Lab"
                  value={form.labName}
                  onChange={(e) => setForm((f) => ({ ...f, labName: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Work Type</label>
                <select
                  value={form.workType}
                  onChange={(e) => setForm((f) => ({ ...f, workType: e.target.value }))}
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue/30"
                >
                  {WORK_TYPES.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Date Sent</label>
                <input
                  type="date"
                  value={form.sentDate}
                  onChange={(e) => setForm((f) => ({ ...f, sentDate: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Expected Return Date</label>
                <input
                  type="date"
                  value={form.expectedDate}
                  onChange={(e) => setForm((f) => ({ ...f, expectedDate: e.target.value }))}
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Shade, size, material notes..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-blue py-2.5 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
              >
                Create Entry
              </button>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-muted hover:border-navy/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items Table */}
      {loading ? (
        <div className="py-12 text-center text-muted">Loading...</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-muted">No lab work entries yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const days = daysUntil(item.expectedDate);
            const isOverdue = days !== null && days < 0 && item.status === "sent";
            return (
              <div key={item.id} className={`rounded-2xl border bg-surface overflow-hidden ${isOverdue ? "border-red-300" : "border-line"}`}>
                <div className="flex items-start justify-between p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.status}
                      </span>
                      <span className="text-sm font-bold text-navy capitalize">{item.workType}</span>
                      {isOverdue && (
                        <span className="rounded-full bg-red-100 text-red-700 px-2.5 py-0.5 text-[11px] font-bold">
                          ⚠ Overdue
                        </span>
                      )}
                      {days !== null && days >= 0 && item.status === "sent" && (
                        <span className="text-xs text-muted">Returns in {days}d</span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-muted">
                      {item.lead?.name || item.patientName} · <span className="font-medium text-navy">{item.labName}</span>
                    </div>
                    {item.description && <div className="text-xs text-muted mt-0.5">{item.description}</div>}
                    <div className="mt-1 text-xs text-muted">
                      Sent: {item.sentDate}
                      {item.expectedDate && ` · Expected: ${item.expectedDate}`}
                      {item.receivedDate && ` · Received: ${item.receivedDate}`}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    {item.status !== "fitted" && (
                      <button
                        onClick={() => initStatusForm(item)}
                        className="rounded-xl border border-blue text-blue px-3 py-1.5 text-xs font-semibold hover:bg-blue hover:text-white transition-colors"
                      >
                        Update
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Update form */}
                {updating === item.id && statusForms[item.id] && (
                  <div className="border-t border-line px-5 pb-5 pt-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1">Status</label>
                        <select
                          value={statusForms[item.id].status}
                          onChange={(e) => setStatusForms((prev) => ({ ...prev, [item.id]: { ...prev[item.id], status: e.target.value } }))}
                          className="w-full rounded-xl border border-line px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue/30"
                        >
                          <option value="sent">Sent to Lab</option>
                          <option value="received">Received</option>
                          <option value="fitted">Fitted</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1">Received Date</label>
                        <input
                          type="date"
                          value={statusForms[item.id].receivedDate}
                          onChange={(e) => setStatusForms((prev) => ({ ...prev, [item.id]: { ...prev[item.id], receivedDate: e.target.value } }))}
                          className="w-full rounded-xl border border-line px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1">Notes</label>
                        <input
                          type="text"
                          value={statusForms[item.id].notes}
                          onChange={(e) => setStatusForms((prev) => ({ ...prev, [item.id]: { ...prev[item.id], notes: e.target.value } }))}
                          placeholder="Any notes..."
                          className="w-full rounded-xl border border-line px-3 py-2 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleUpdate(item.id)}
                        className="rounded-xl bg-blue px-5 py-2 text-xs font-bold text-white hover:bg-blue-deep transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setUpdating(null)}
                        className="rounded-xl border border-line px-5 py-2 text-xs font-semibold text-muted hover:border-navy/30 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
