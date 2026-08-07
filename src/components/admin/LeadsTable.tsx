"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// All clinic time slots (11:00 AM – 9:30 PM, every 30 min) — admin always sees all slots
const CLINIC_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let mins = 11 * 60; mins <= 21 * 60 + 30; mins += 30) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h < 12 ? "AM" : "PM";
    const h12 = h % 12 || 12;
    slots.push(`${h12}:${String(m).padStart(2, "0")} ${ampm}`);
  }
  return slots;
})();

// ── Types ──────────────────────────────────────────────────────────────────────

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

type Document = {
  id: string;
  fileName: string;
  fileUrl: string;
  docType: string;
  createdAt: string;
};

type User = { name: string; role: string; permissions: string[] };

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_TABS = ["all", "pending", "confirmed", "followup", "completed", "cancelled", "no_show"] as const;
type Tab = (typeof STATUS_TABS)[number];

const STATUS_BADGE: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-700",
  no_show:   "bg-gray-100 text-gray-600",
  followup:  "bg-purple-100 text-purple-800",
};

const TAB_LABEL: Record<Tab, string> = {
  all:       "All",
  pending:   "⏳ Pending",
  confirmed: "✅ Confirmed",
  followup:  "🔁 Follow-up Due",
  completed: "🏁 Completed",
  cancelled: "❌ Cancelled",
  no_show:   "🚫 No-show",
};

const VISIT_LABELS: Record<string, string> = {
  consultation: "1st Consultation",
  treatment:    "Treatment Session",
  followup:     "Follow-up",
  resolved:     "Case Resolved",
};

const PAYMENT_LABELS: Record<string, string> = {
  cash:    "💵 Cash",
  upi:     "📱 UPI",
  card:    "💳 Card",
  online:  "🌐 Online",
  waived:  "🎁 Waived",
  pending: "⏳ Pending",
};

const DOC_TYPE_LABELS: Record<string, string> = {
  xray:         "X-ray",
  report:       "Report",
  prescription: "Prescription",
  other:        "Other",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function isFollowupDue(lead: LeadRow): boolean {
  // A followup is "due" if today >= slotDate (the next visit date stored in slot_date)
  if (lead.status !== "followup") return false;
  const today = new Date().toISOString().slice(0, 10);
  return lead.slot_date <= today;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function LeadsTable({
  initialLeads,
  initialUser,
}: {
  initialLeads?: LeadRow[];
  initialUser?: User;
} = {}) {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRow[]>(initialLeads ?? []);
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completeModal, setCompleteModal] = useState<{ open: false } | { open: true; lead: LeadRow }>({ open: false });
  const [docPanel, setDocPanel] = useState<{ open: false } | { open: true; lead: LeadRow }>({ open: false });

  // ── Add appointment form ──
  const [showAdd,    setShowAdd]    = useState(false);
  const [addSaving,  setAddSaving]  = useState(false);
  const [addError,   setAddError]   = useState("");
  const [addName,    setAddName]    = useState("");
  const [addPhone,   setAddPhone]   = useState("");
  const [addEmail,   setAddEmail]   = useState("");
  const [addTreat,   setAddTreat]   = useState("");
  const [addDate,    setAddDate]    = useState("");
  const [addTime,    setAddTime]    = useState("");
  const [addDob,     setAddDob]     = useState("");
  const [addGender,  setAddGender]  = useState("");
  const [addStatus,  setAddStatus]  = useState<"confirmed" | "pending">("confirmed");

  // ── Edit lead state ──
  const [editId,     setEditId]     = useState<string | null>(null);
  const [editName,   setEditName]   = useState("");
  const [editEmail,  setEditEmail]  = useState("");
  const [editTreat,  setEditTreat]  = useState("");
  const [editDate,   setEditDate]   = useState("");
  const [editTime,   setEditTime]   = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError,  setEditError]  = useState("");

  function resetAddForm() {
    setAddName(""); setAddPhone(""); setAddEmail(""); setAddTreat("");
    setAddDate(""); setAddTime(""); setAddDob(""); setAddGender("");
    setAddStatus("confirmed"); setAddError("");
  }

  function openEdit(l: LeadRow) {
    setEditId(l.id);
    setEditName(l.name);
    setEditEmail(l.email);
    setEditTreat(l.treatment);
    setEditDate(l.slot_date);
    setEditTime(l.slot_time);
    setEditError("");
  }

  async function saveEdit(id: string) {
    setEditSaving(true); setEditError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName, email: editEmail, treatment: editTreat,
          slot_date: editDate, slot_time: editTime,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Update failed");
      setEditId(null);
      await load();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed");
    } finally { setEditSaving(false); }
  }

  async function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddSaving(true); setAddError("");
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName, phone: addPhone, email: addEmail,
          treatment: addTreat, slot_date: addDate, slot_time: addTime,
          dob: addDob || undefined, gender: addGender || undefined,
          status: addStatus,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to add");
      resetAddForm(); setShowAdd(false);
      await load();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed");
    } finally { setAddSaving(false); }
  }

  const todayIst = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/leads");
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setLeads(data.leads || []);
    setUser(data.user || null);
  }, [router]);

  // Only fetch on mount if we didn't receive server-side initial data
  const hasInitial = useState(() => !!initialLeads)[0];
  useEffect(() => {
    if (!hasInitial) load().catch((e) => setError(e.message));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Tab counts
  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] = t === "all" ? leads.length : leads.filter((l) => l.status === t).length;
    return acc;
  }, {} as Record<Tab, number>);

  const followupDueCount = leads.filter(isFollowupDue).length;

  const filtered = (() => {
    if (tab === "all") return leads;
    return leads.filter((l) => l.status === tab);
  })();

  // Sort: followup due + pending first, then by slot date
  const sorted = [...filtered].sort((a, b) => {
    const aPriority = (a.status === "pending" || isFollowupDue(a)) ? 0 : 1;
    const bPriority = (b.status === "pending" || isFollowupDue(b)) ? 0 : 1;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.slot_date.localeCompare(b.slot_date);
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">Leads & Appointments</h1>
          {user && (
            <p className="text-xs text-muted mt-0.5">
              Signed in as <strong>{user.name}</strong> · {user.role}
            </p>
          )}
          {followupDueCount > 0 && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
              🔁 {followupDueCount} follow-up{followupDueCount > 1 ? "s" : ""} due today
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAdd((v) => !v); if (showAdd) resetAddForm(); }}
            className="rounded-full bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-soft transition-colors"
          >
            {showAdd ? "✕ Cancel" : "+ Add Appointment"}
          </button>
          <button
            onClick={() => load()}
            className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
          >
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* ── Add Appointment Form ── */}
      {showAdd && (
        <form onSubmit={submitAdd} className="mb-5 rounded-2xl border border-blue/30 bg-blue/5 p-5 space-y-4">
          <p className="text-sm font-bold text-navy">New Appointment</p>
          {addError && <p className="text-xs text-red-600">{addError}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold text-navy">
              Patient Name <span className="text-red-500">*</span>
              <input required value={addName} onChange={(e) => setAddName(e.target.value)}
                placeholder="Full name"
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white" />
            </label>
            <label className="grid gap-1 text-xs font-bold text-navy">
              Phone <span className="text-red-500">*</span>
              <input required type="tel" value={addPhone} onChange={(e) => setAddPhone(e.target.value)}
                placeholder="91XXXXXXXXXX or 10-digit"
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white" />
            </label>
            <label className="grid gap-1 text-xs font-bold text-navy">
              Email <span className="font-normal text-muted">(optional)</span>
              <input type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)}
                placeholder="patient@email.com"
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white" />
            </label>
            <label className="grid gap-1 text-xs font-bold text-navy">
              Date of Birth <span className="font-normal text-muted">(optional)</span>
              <input type="date" value={addDob} max={todayIst}
                onChange={(e) => setAddDob(e.target.value)}
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white" />
            </label>
            <label className="grid gap-1 text-xs font-bold text-navy">
              Gender <span className="font-normal text-muted">(optional)</span>
              <select value={addGender} onChange={(e) => setAddGender(e.target.value)}
                className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-blue bg-white">
                <option value="">— Select —</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="grid gap-1 text-xs font-bold text-navy">
              Treatment <span className="font-normal text-muted">(optional)</span>
              <input value={addTreat} onChange={(e) => setAddTreat(e.target.value)}
                placeholder="e.g. Implant, Cleaning, Crown"
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white" />
            </label>
            <label className="grid gap-1 text-xs font-bold text-navy">
              Date <span className="text-red-500">*</span>
              <input required type="date" value={addDate} min={todayIst}
                onChange={(e) => setAddDate(e.target.value)}
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white" />
            </label>
            <label className="grid gap-1 text-xs font-bold text-navy">
              Time Slot <span className="text-red-500">*</span>
              <select required value={addTime} onChange={(e) => setAddTime(e.target.value)}
                className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-blue bg-white">
                <option value="">— Select time —</option>
                {CLINIC_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs font-bold text-navy">Status</label>
            {(["confirmed", "pending"] as const).map((s) => (
              <label key={s} className="flex items-center gap-1.5 text-xs text-navy cursor-pointer">
                <input type="radio" name="addStatus" value={s} checked={addStatus === s}
                  onChange={() => setAddStatus(s)} className="accent-blue" />
                {s === "confirmed" ? "✅ Confirmed" : "⏳ Pending"}
              </label>
            ))}
          </div>

          <button type="submit" disabled={addSaving}
            className="rounded-full bg-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-deep disabled:opacity-60 transition-colors">
            {addSaving ? "Adding…" : "Add Appointment"}
          </button>
        </form>
      )}

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
              <th className="px-4 py-3 whitespace-nowrap">Slot / Date</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Treatment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                  {tab === "all" ? "No leads yet. Share the website link to get bookings!" : `No ${tab} leads.`}
                </td>
              </tr>
            ) : (
              sorted.map((l) => {
                const isDue = isFollowupDue(l);
                const isExpanded = expandedId === l.id;

                return (
                  <>
                    <tr
                      key={l.id}
                      onClick={() => setExpandedId(isExpanded ? null : l.id)}
                      className={`border-t border-line align-top cursor-pointer transition-colors ${
                        isDue
                          ? "bg-purple-50 hover:bg-purple-100/60"
                          : "hover:bg-bg-soft/40"
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isDue && (
                          <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            DUE TODAY
                          </div>
                        )}
                        <div className="font-semibold text-navy text-xs">{l.slot_label}</div>
                        <div className="text-[11px] text-muted">{l.created_at_ist}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-navy">{l.name}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`tel:${l.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue hover:underline font-medium text-xs"
                        >
                          {l.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-muted text-xs max-w-[140px] truncate">{l.treatment || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_BADGE[l.status] || "bg-gray-100 text-gray-600"}`}>
                          {l.status.replace("_", " ")}
                        </span>
                        {l.confirmed_by && (
                          <p className="mt-1 text-[10px] text-muted">{l.confirmed_by}</p>
                        )}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-1.5 min-w-[140px]">
                          {l.status === "pending" && (
                            <button
                              disabled={busyId === l.id}
                              onClick={() => confirmLead(l.id)}
                              className="rounded-full bg-green-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
                            >
                              {busyId === l.id ? "…" : "✓ Confirm → WhatsApp"}
                            </button>
                          )}
                          {(l.status === "confirmed" || l.status === "followup") &&
                            user?.permissions.includes("complete_visits") && (
                              <button
                                disabled={busyId === l.id}
                                onClick={() => setCompleteModal({ open: true, lead: l })}
                                className="rounded-full bg-blue px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-deep disabled:opacity-60 transition-colors"
                              >
                                📋 Record Visit
                              </button>
                            )}
                          {(l.status === "completed" || l.status === "followup" || l.status === "confirmed") && (
                            <button
                              onClick={() => setDocPanel({ open: true, lead: l })}
                              className="rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
                            >
                              📎 Documents
                            </button>
                          )}
                          {(l.status === "completed" || l.status === "followup" || l.status === "resolved") && (
                            <a
                              href={`/api/admin/invoice/${l.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-navy hover:border-blue hover:text-blue text-center transition-colors"
                            >
                              🧾 Invoice
                            </a>
                          )}
                          {l.status !== "cancelled" && l.status !== "completed" && l.status !== "resolved" && (
                            <button
                              disabled={busyId === l.id}
                              onClick={() => {
                                if (confirm(`Cancel appointment for ${l.name}?`)) {
                                  setStatus(l.id, "cancelled");
                                }
                              }}
                              className="rounded-full border border-red-200 px-3 py-1.5 text-[11px] font-bold text-red-700 hover:bg-red-50 disabled:opacity-60 transition-colors"
                            >
                              ✕ Cancel
                            </button>
                          )}
                          <button
                            onClick={() => {
                              openEdit(l);
                              setExpandedId(l.id);
                            }}
                            className="rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr key={`${l.id}-detail`} className="border-t border-line bg-bg-soft/60">
                        <td colSpan={6} className="px-6 py-4">
                          {editId === l.id ? (
                            /* ── Inline edit form ── */
                            <div className="max-w-2xl">
                              <p className="mb-3 text-xs font-bold text-navy uppercase tracking-wide">Edit Details</p>
                              {editError && <p className="mb-2 text-xs text-red-600">{editError}</p>}
                              <div className="grid gap-3 sm:grid-cols-2">
                                <label className="grid gap-1 text-xs font-semibold text-navy">
                                  Patient Name
                                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                                    className="rounded-xl border border-line px-3 py-2 text-sm font-normal outline-none focus:border-blue bg-white" />
                                </label>
                                <label className="grid gap-1 text-xs font-semibold text-navy">
                                  Email
                                  <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                                    className="rounded-xl border border-line px-3 py-2 text-sm font-normal outline-none focus:border-blue bg-white" />
                                </label>
                                <label className="grid gap-1 text-xs font-semibold text-navy">
                                  Treatment
                                  <input value={editTreat} onChange={(e) => setEditTreat(e.target.value)}
                                    className="rounded-xl border border-line px-3 py-2 text-sm font-normal outline-none focus:border-blue bg-white" />
                                </label>
                                <label className="grid gap-1 text-xs font-semibold text-navy">
                                  Appointment Date
                                  <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                                    className="rounded-xl border border-line px-3 py-2 text-sm font-normal outline-none focus:border-blue bg-white" />
                                </label>
                                <label className="grid gap-1 text-xs font-semibold text-navy">
                                  Time Slot
                                  <select value={editTime} onChange={(e) => setEditTime(e.target.value)}
                                    className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue bg-white">
                                    <option value="">— Select time —</option>
                                    {CLINIC_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </label>
                              </div>
                              <div className="mt-3 flex gap-2">
                                <button onClick={() => saveEdit(l.id)} disabled={editSaving}
                                  className="rounded-full bg-blue px-5 py-2 text-xs font-bold text-white hover:bg-blue-deep disabled:opacity-60 transition-colors">
                                  {editSaving ? "Saving…" : "💾 Save Changes"}
                                </button>
                                <button onClick={() => setEditId(null)}
                                  className="rounded-full border border-line px-5 py-2 text-xs font-semibold text-muted hover:bg-bg-soft transition-colors">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* ── Static info view ── */
                            <div className="grid gap-2 text-xs text-muted sm:grid-cols-3">
                              <div>
                                <span className="font-bold text-navy uppercase tracking-wide text-[10px]">Message</span>
                                <p className="mt-0.5">{l.message || "—"}</p>
                              </div>
                              <div>
                                <span className="font-bold text-navy uppercase tracking-wide text-[10px]">Email</span>
                                <p className="mt-0.5">{l.email || "—"}</p>
                              </div>
                              <div>
                                <span className="font-bold text-navy uppercase tracking-wide text-[10px]">Confirmed by</span>
                                <p className="mt-0.5">{l.confirmed_by || "—"} {l.confirmed_at_ist ? `· ${l.confirmed_at_ist}` : ""}</p>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {completeModal.open && (
        <RecordVisitModal
          lead={completeModal.lead}
          onClose={() => setCompleteModal({ open: false })}
          onDone={async () => { setCompleteModal({ open: false }); await load(); }}
        />
      )}
      {docPanel.open && (
        <DocumentPanel
          lead={docPanel.lead}
          onClose={() => setDocPanel({ open: false })}
        />
      )}
    </div>
  );
}

// ── Record Visit Modal ─────────────────────────────────────────────────────────

type VisitType = "consultation" | "treatment" | "followup" | "resolved";
type PaymentMode = "cash" | "upi" | "card" | "online" | "waived" | "pending";

const VISIT_OPTIONS: { value: VisitType; label: string; desc: string }[] = [
  { value: "consultation", label: "1st Consultation",   desc: "Initial assessment, treatment plan discussed" },
  { value: "treatment",    label: "Treatment Session",  desc: "Procedure carried out (crown, implant, etc.)" },
  { value: "followup",     label: "Follow-up Needed",   desc: "Visit done, patient to return on a specific date" },
  { value: "resolved",     label: "Case Resolved",      desc: "Treatment complete, case closed" },
];

function RecordVisitModal({
  lead,
  onClose,
  onDone,
}: {
  lead: LeadRow;
  onClose: () => void;
  onDone: () => void;
}) {
  const [visitType, setVisitType] = useState<VisitType>("consultation");
  const [treatmentDone, setTreatmentDone] = useState(lead.treatment || "");
  const [notes, setNotes] = useState("");
  const [nextVisitDate, setNextVisitDate] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const needsFollowupDate = visitType === "followup";
  const needsPayment = true; // every visit type is chargeable

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (needsFollowupDate && !nextVisitDate) {
      setErr("Please select a follow-up date.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitType,
          treatmentDone,
          notes,
          nextVisitDate: nextVisitDate || undefined,
          paymentMode: needsPayment ? paymentMode : undefined,
          paymentAmount: needsPayment && paymentAmount ? Number(paymentAmount) : undefined,
          transactionId: (paymentMode === "upi" || paymentMode === "online") ? transactionId : undefined,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[var(--shadow)] my-auto">
        <h2 className="text-lg font-bold text-navy">Record Visit</h2>
        <p className="mt-1 text-sm text-muted">{lead.name} · {lead.slot_label}</p>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-5">

          {/* Visit type */}
          <div>
            <p className="mb-2 text-xs font-bold text-navy uppercase tracking-wide">Visit Type</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {VISIT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer flex-col gap-0.5 rounded-xl border p-3 transition-colors ${
                    visitType === opt.value
                      ? "border-blue bg-blue/5"
                      : "border-line hover:border-blue/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visitType"
                      value={opt.value}
                      checked={visitType === opt.value}
                      onChange={() => setVisitType(opt.value)}
                      className="accent-blue"
                    />
                    <span className="text-xs font-bold text-navy">{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-muted pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Treatment done */}
          <label className="grid gap-1 text-xs font-semibold text-navy">
            Treatment / Work Done
            <input
              value={treatmentDone}
              onChange={(e) => setTreatmentDone(e.target.value)}
              placeholder="e.g. Porcelain crown #36, X-ray taken"
              className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue"
            />
          </label>

          {/* Notes */}
          <label className="grid gap-1 text-xs font-semibold text-navy">
            Clinical Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Observations, patient feedback, next steps…"
              className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue resize-none"
            />
          </label>

          {/* Follow-up date (required if visitType = followup) */}
          {needsFollowupDate && (
            <label className="grid gap-1 text-xs font-semibold text-navy">
              <span>Follow-up Date <span className="text-red-500">*</span></span>
              <input
                type="date"
                required
                value={nextVisitDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setNextVisitDate(e.target.value)}
                className="rounded-xl border border-blue px-3 py-2.5 text-sm font-normal outline-none focus:border-blue"
              />
              <span className="text-[11px] text-muted font-normal">Patient will appear as "Follow-up Due" on this date in the CRM.</span>
            </label>
          )}

          {/* Optional next visit date for non-followup */}
          {!needsFollowupDate && (
            <label className="grid gap-1 text-xs font-semibold text-navy">
              Suggest Next Visit Date <span className="font-normal text-muted">(optional)</span>
              <input
                type="date"
                value={nextVisitDate}
                onChange={(e) => setNextVisitDate(e.target.value)}
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue"
              />
            </label>
          )}

          {/* Payment (for treatment + resolved) */}
          {needsPayment && (
            <div className="rounded-xl border border-line p-4 flex flex-col gap-3">
              <p className="text-xs font-bold text-navy uppercase tracking-wide">Payment</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-navy">
                  Mode
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                    className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white"
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="upi">📱 UPI / GPay / PhonePe</option>
                    <option value="card">💳 Card</option>
                    <option value="online">🌐 Online Transfer</option>
                    <option value="waived">🎁 Waived / Complimentary</option>
                    <option value="pending">⏳ Payment Pending</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-semibold text-navy">
                  Amount (₹)
                  <input
                    type="number"
                    min="0"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue"
                  />
                </label>
              </div>
              {(paymentMode === "upi" || paymentMode === "online") && (
                <label className="grid gap-1 text-xs font-semibold text-navy">
                  Transaction / UTR ID
                  <input
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. T2408XXXXXXXXX"
                    className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue"
                  />
                </label>
              )}
            </div>
          )}

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
              {saving ? "Saving…" : visitType === "followup" ? "Save & Set Follow-up" : "Save Visit Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Document Panel ─────────────────────────────────────────────────────────────

const DOC_TYPES = ["xray", "report", "prescription", "other"] as const;

function DocumentPanel({ lead, onClose }: { lead: LeadRow; onClose: () => void }) {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState<string>("xray");
  const [error, setError] = useState("");
  const [blobNotConfigured, setBlobNotConfigured] = useState(false);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/documents`);
      const data = await res.json();
      setDocs(data.documents || []);
    } finally { setLoading(false); }
  }, [lead.id]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("docType", docType);
      const res = await fetch(`/api/admin/leads/${lead.id}/documents`, { method: "POST", body: form });
      const data = await res.json();
      if (data.setup_needed) {
        setBlobNotConfigured(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Upload failed");
      await loadDocs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally { setUploading(false); e.target.value = ""; }
  }

  async function remove(docId: string) {
    if (!confirm("Delete this document?")) return;
    await fetch(`/api/admin/leads/${lead.id}/documents?docId=${docId}`, { method: "DELETE" });
    await loadDocs();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40">
      <div className="h-full w-full max-w-md overflow-y-auto bg-white shadow-[var(--shadow)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="font-bold text-navy">Documents</h2>
            <p className="text-xs text-muted mt-0.5">{lead.name} · {lead.slot_label}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-bg-soft transition-colors text-muted">✕</button>
        </div>

        <div className="flex-1 px-5 py-4 flex flex-col gap-4">
          {/* Blob not configured notice */}
          {blobNotConfigured && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <p className="font-bold">Storage not set up yet</p>
              <p className="mt-1 text-xs">To enable document uploads, go to <strong>Vercel Dashboard → Storage → Create Blob</strong>, then add the <code>BLOB_READ_WRITE_TOKEN</code> environment variable. See the setup guide for details.</p>
            </div>
          )}

          {/* Upload area */}
          {!blobNotConfigured && (
            <div className="rounded-xl border border-dashed border-line p-4">
              <p className="text-xs font-bold text-navy mb-3">Upload Document</p>
              <div className="flex gap-2 mb-3">
                {DOC_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setDocType(t)}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                      docType === t
                        ? "bg-navy text-white"
                        : "border border-line text-muted hover:border-blue hover:text-blue"
                    }`}
                  >
                    {DOC_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-bg-soft px-4 py-6 text-sm font-semibold text-muted hover:border-blue hover:text-blue transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                <span>{uploading ? "Uploading…" : "📎 Choose file to upload"}</span>
                <input type="file" className="sr-only" onChange={upload} accept="image/*,.pdf,.dcm" />
              </label>
              <p className="mt-1.5 text-[11px] text-muted">JPG, PNG, PDF, DICOM · max 20 MB</p>
              {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
            </div>
          )}

          {/* Document list */}
          <div>
            <p className="text-xs font-bold text-navy mb-2">Uploaded Files</p>
            {loading ? (
              <p className="text-sm text-muted">Loading…</p>
            ) : docs.length === 0 ? (
              <p className="text-sm text-muted py-4 text-center">No documents yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {docs.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                    <span className="text-2xl flex-shrink-0">
                      {d.docType === "xray" ? "🦷" : d.docType === "report" ? "📄" : d.docType === "prescription" ? "💊" : "📎"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-navy truncate">{d.fileName}</p>
                      <p className="text-[10px] text-muted">{DOC_TYPE_LABELS[d.docType] || d.docType}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
                      >
                        View
                      </a>
                      <button
                        onClick={() => remove(d.id)}
                        className="rounded-full border border-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
