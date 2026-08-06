"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  message: string;
  slot_date: string;
  slot_time: string;
  slot_label: string;
  status: string;
  created_at_ist: string;
  confirmed_at_ist?: string | null;
  confirmed_by?: string;
  whatsapp_confirm_sent?: boolean;
};

type User = { name: string; role: string; permissions: string[] };

const STATUS_TABS = ["all", "pending", "confirmed", "completed", "cancelled", "no_show"] as const;
type Tab = (typeof STATUS_TABS)[number];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-600",
};

const TAB_LABEL: Record<Tab, string> = {
  all: "All",
  pending: "⏳ Pending",
  confirmed: "✅ Confirmed",
  completed: "🏁 Completed",
  cancelled: "❌ Cancelled",
  no_show: "🚫 No-show",
};

type CompleteModal = { open: false } | { open: true; lead: LeadRow };

export function LeadsTable() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [modal, setModal] = useState<CompleteModal>({ open: false });

  async function load() {
    const res = await fetch("/api/admin/leads");
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setLeads(data.leads || []);
    setUser(data.user || null);
  }

  useEffect(() => { load().catch((e) => setError(e.message)); }, []);

  async function confirmLead(id: string) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}/confirm`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Confirm failed");
      if (data.whatsapp?.mode === "wa_me_link" && data.whatsapp?.patientConfirmUrl) {
        window.open(data.whatsapp.patientConfirmUrl, "_blank", "noopener,noreferrer");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirm failed");
    } finally { setBusyId(null); }
  }

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Update failed"); }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally { setBusyId(null); }
  }

  const filtered = tab === "all" ? leads : leads.filter((l) => l.status === tab);

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] = t === "all" ? leads.length : leads.filter((l) => l.status === t).length;
    return acc;
  }, {} as Record<Tab, number>);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">Leads & Appointments</h1>
          {user && (
            <p className="text-xs text-muted mt-0.5">
              Signed in as <strong>{user.name}</strong> · {user.role}
            </p>
          )}
        </div>
        <button
          onClick={() => load()}
          className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
        >
          ↺ Refresh
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {/* Status filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              tab === t
                ? "bg-navy text-white"
                : "bg-white border border-line text-muted hover:border-blue hover:text-blue"
            }`}
          >
            {TAB_LABEL[t]}
            {counts[t] > 0 && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t ? "bg-white/20" : "bg-bg-soft"}`}>
                {counts[t]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-[var(--shadow-sm)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg-soft text-[11px] uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Booked slot</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Treatment</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted">
                  {tab === "all" ? "No leads yet. Share the website link to get bookings!" : `No ${tab} leads.`}
                </td>
              </tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} className="border-t border-line align-top hover:bg-bg-soft/40 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-navy">{l.slot_label}</span>
                    <br />
                    <span className="text-[11px] text-muted">{l.created_at_ist}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy">{l.name}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${l.phone}`} className="text-blue hover:underline font-medium">
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted">{l.treatment || "—"}</td>
                  <td className="px-4 py-3 max-w-[200px] text-muted text-xs">{l.message || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_BADGE[l.status] || "bg-gray-100 text-gray-600"}`}>
                      {l.status.replace("_", " ")}
                    </span>
                    {l.confirmed_by && (
                      <p className="mt-1 text-[10px] text-muted">
                        {l.confirmed_by}
                        {l.confirmed_at_ist ? ` · ${l.confirmed_at_ist}` : ""}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5 min-w-[150px]">
                      {l.status === "pending" && (
                        <button
                          disabled={busyId === l.id}
                          onClick={() => confirmLead(l.id)}
                          className="rounded-full bg-green-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
                        >
                          {busyId === l.id ? "…" : "✓ Confirm → WhatsApp"}
                        </button>
                      )}
                      {l.status === "confirmed" && user?.permissions.includes("complete_visits") && (
                        <button
                          disabled={busyId === l.id}
                          onClick={() => setModal({ open: true, lead: l })}
                          className="rounded-full bg-blue px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-deep disabled:opacity-60 transition-colors"
                        >
                          🏁 Mark Completed
                        </button>
                      )}
                      {l.status !== "cancelled" && l.status !== "completed" && (
                        <button
                          disabled={busyId === l.id}
                          onClick={() => {
                            if (confirm(`Cancel appointment for ${l.name} on ${l.slot_label}?`)) {
                              setStatus(l.id, "cancelled");
                            }
                          }}
                          className="rounded-full border border-red-200 px-3 py-1.5 text-[11px] font-bold text-red-700 hover:bg-red-50 disabled:opacity-60 transition-colors"
                        >
                          ✕ Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mark Completed Modal */}
      {modal.open && (
        <CompleteModal
          lead={modal.lead}
          onClose={() => setModal({ open: false })}
          onDone={async () => { setModal({ open: false }); await load(); }}
        />
      )}
    </div>
  );
}

// ── Complete with notes modal ──────────────────────────────────────────────────

function CompleteModal({
  lead,
  onClose,
  onDone,
}: {
  lead: LeadRow;
  onClose: () => void;
  onDone: () => void;
}) {
  const [treatmentDone, setTreatmentDone] = useState(lead.treatment || "");
  const [notes, setNotes] = useState("");
  const [nextVisitDate, setNextVisitDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treatmentDone, notes, nextVisitDate: nextVisitDate || undefined }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[var(--shadow)]">
        <h2 className="text-lg font-bold text-navy">Mark Completed</h2>
        <p className="mt-1 text-sm text-muted">
          {lead.name} · {lead.slot_label}
        </p>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <label className="grid gap-1 text-sm font-semibold text-navy">
            Treatment Done
            <input
              value={treatmentDone}
              onChange={(e) => setTreatmentDone(e.target.value)}
              placeholder="e.g. Porcelain crown #36"
              className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue"
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-navy">
            Notes / Observations
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Clinical notes, patient feedback, follow-up instructions…"
              className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue resize-none"
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-navy">
            Next Visit Date <span className="font-normal text-muted">(optional)</span>
            <input
              type="date"
              value={nextVisitDate}
              onChange={(e) => setNextVisitDate(e.target.value)}
              className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue"
            />
          </label>

          {err && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-line py-2.5 text-sm font-semibold text-muted hover:bg-bg-soft transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-blue py-2.5 text-sm font-bold text-white hover:bg-blue-deep disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving…" : "Save & Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
