"use client";

import { useCallback, useEffect, useState } from "react";

type Med = {
  id: string;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

type SavedRx = {
  id: string;
  patientName: string;
  chiefComplaint: string;
  diagnosis: string;
  medications: Med[];
  advice: string;
  createdBy: string;
  createdAt: string;
  leadId?: string | null;
};

const FREQ_OPTIONS = [
  "Once daily",
  "Twice daily (BD)",
  "3 times a day (TDS)",
  "4 times a day (QID)",
  "Every 8 hours",
  "Every 12 hours",
  "Before bed (HS)",
  "SOS / As needed",
];

const INSTR_OPTIONS = [
  "After food",
  "Before food",
  "With food",
  "With warm water",
  "Dissolve in water",
  "Apply topically",
];

function newMed(): Med {
  return { id: Math.random().toString(36).slice(2), drug: "", dosage: "", frequency: "Twice daily (BD)", duration: "5 days", instructions: "After food" };
}

// ── Past Rx list ──────────────────────────────────────────────────────────────
function PastRxList({ phone }: { phone: string }) {
  const [list, setList]       = useState<SavedRx[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/prescriptions?phone=${encodeURIComponent(phone)}`);
    const d   = await res.json();
    setList(d.prescriptions ?? []);
    setLoading(false);
  }, [phone]);

  useEffect(() => { load(); }, [load]);

  async function del(id: string) {
    if (!confirm("Delete this prescription?")) return;
    await fetch(`/api/admin/prescriptions/${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) return <p className="text-xs text-muted py-3">Loading…</p>;
  if (list.length === 0) return <p className="text-xs text-muted py-3 italic">No past prescriptions.</p>;

  return (
    <div className="space-y-2">
      {list.map((rx) => (
        <div key={rx.id} className="rounded-xl border border-line bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-navy">
                {new Date(rx.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                {rx.chiefComplaint ? ` · ${rx.chiefComplaint}` : ""}
              </p>
              <p className="text-[11px] text-muted mt-0.5">
                {rx.medications.length} medication{rx.medications.length !== 1 ? "s" : ""} · by {rx.createdBy}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {rx.medications.map((m, i) => (
                  <span key={i} className="rounded-full bg-blue/10 text-blue px-2 py-0.5 text-[10px] font-semibold">
                    {m.drug} {m.dosage}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <a
                href={`/api/admin/prescriptions/${rx.id}?format=pdf`}
                target="_blank" rel="noopener noreferrer"
                className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
              >
                🖨 Print
              </a>
              <button
                onClick={() => del(rx.id)}
                className="rounded-full border border-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function PrescriptionModal({
  patientPhone,
  patientName,
  leadId,
  onClose,
}: {
  patientPhone: string;
  patientName: string;
  leadId?: string;
  onClose: () => void;
}) {
  const [tab,            setTab]           = useState<"new" | "past">("new");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosis,      setDiagnosis]     = useState("");
  const [meds,           setMeds]          = useState<Med[]>([newMed()]);
  const [advice,         setAdvice]        = useState("Drink plenty of water. Rest adequately. Avoid cold/spicy food. Return if symptoms persist beyond 3 days.");
  const [saving,         setSaving]        = useState(false);
  const [savedId,        setSavedId]       = useState<string | null>(null);
  const [error,          setError]         = useState("");

  function addMed() { setMeds((prev) => [...prev, newMed()]); }
  function removeMed(id: string) { setMeds((prev) => prev.filter((m) => m.id !== id)); }
  function updateMed(id: string, field: keyof Med, value: string) {
    setMeds((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const validMeds = meds.filter((m) => m.drug.trim());
    if (validMeds.length === 0) { setError("Add at least one medication."); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientPhone, patientName, leadId: leadId ?? null,
          chiefComplaint, diagnosis, medications: validMeds, advice,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setSavedId(d.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-6 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,0,0,.2)] my-auto flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-line px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-navy">💊 Prescription</h2>
            <p className="text-xs text-muted mt-0.5">{patientName} · {patientPhone}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy rounded-full p-1.5 hover:bg-bg-soft transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-line px-6">
          {(["new", "past"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-px ${
                tab === t ? "border-navy text-navy" : "border-transparent text-muted hover:text-navy"
              }`}>
              {t === "new" ? "✍️ New Prescription" : "📋 Past Prescriptions"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          {tab === "past" ? (
            <PastRxList phone={patientPhone} />
          ) : savedId ? (
            /* ── Success screen ── */
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="text-4xl">✅</div>
              <p className="font-bold text-navy">Prescription saved!</p>
              <div className="flex gap-3">
                <a href={`/api/admin/prescriptions/${savedId}?format=pdf`} target="_blank" rel="noopener noreferrer"
                  className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-soft transition-colors">
                  🖨 Print / PDF
                </a>
                <button onClick={() => { setSavedId(null); setMeds([newMed()]); setChiefComplaint(""); setDiagnosis(""); }}
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted hover:bg-bg-soft transition-colors">
                  Write Another
                </button>
              </div>
            </div>
          ) : (
            /* ── New Rx form ── */
            <form onSubmit={submit} className="space-y-5">
              {/* Clinical info */}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-navy">
                  Chief Complaint
                  <input value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="e.g. Tooth pain upper right"
                    className="rounded-xl border border-line px-3 py-2 text-sm font-normal outline-none focus:border-blue" />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-navy">
                  Diagnosis
                  <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute pulpitis #16"
                    className="rounded-xl border border-line px-3 py-2 text-sm font-normal outline-none focus:border-blue" />
                </label>
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-navy">Medications</p>
                  <button type="button" onClick={addMed}
                    className="rounded-full bg-blue/10 text-blue px-3 py-1 text-[11px] font-bold hover:bg-blue hover:text-white transition-colors">
                    + Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {meds.map((m, idx) => (
                    <div key={m.id} className="rounded-xl border border-line bg-bg-soft/50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wide">Medicine {idx + 1}</span>
                        {meds.length > 1 && (
                          <button type="button" onClick={() => removeMed(m.id)}
                            className="text-[10px] text-red-500 hover:text-red-700 font-semibold transition-colors">✕ Remove</button>
                        )}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="grid gap-1 text-[11px] font-semibold text-navy">
                          Drug Name <span className="text-red-500">*</span>
                          <input required value={m.drug} onChange={(e) => updateMed(m.id, "drug", e.target.value)}
                            placeholder="e.g. Amoxicillin"
                            className="rounded-lg border border-line px-2.5 py-2 text-sm font-normal outline-none focus:border-blue bg-white" />
                        </label>
                        <label className="grid gap-1 text-[11px] font-semibold text-navy">
                          Dosage
                          <input value={m.dosage} onChange={(e) => updateMed(m.id, "dosage", e.target.value)}
                            placeholder="e.g. 500mg"
                            className="rounded-lg border border-line px-2.5 py-2 text-sm font-normal outline-none focus:border-blue bg-white" />
                        </label>
                        <label className="grid gap-1 text-[11px] font-semibold text-navy">
                          Frequency
                          <select value={m.frequency} onChange={(e) => updateMed(m.id, "frequency", e.target.value)}
                            className="rounded-lg border border-line px-2.5 py-2 text-sm outline-none focus:border-blue bg-white">
                            {FREQ_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </label>
                        <label className="grid gap-1 text-[11px] font-semibold text-navy">
                          Duration
                          <input value={m.duration} onChange={(e) => updateMed(m.id, "duration", e.target.value)}
                            placeholder="e.g. 5 days"
                            className="rounded-lg border border-line px-2.5 py-2 text-sm font-normal outline-none focus:border-blue bg-white" />
                        </label>
                        <label className="grid gap-1 text-[11px] font-semibold text-navy sm:col-span-2">
                          Instructions
                          <select value={m.instructions} onChange={(e) => updateMed(m.id, "instructions", e.target.value)}
                            className="rounded-lg border border-line px-2.5 py-2 text-sm outline-none focus:border-blue bg-white">
                            {INSTR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General advice */}
              <label className="grid gap-1 text-xs font-semibold text-navy">
                General Advice / Instructions
                <textarea value={advice} onChange={(e) => setAdvice(e.target.value)} rows={3}
                  className="rounded-xl border border-line px-3 py-2 text-sm font-normal outline-none focus:border-blue resize-none" />
              </label>

              {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <button type="submit" disabled={saving}
                className="w-full rounded-full bg-navy py-2.5 text-sm font-bold text-white hover:bg-navy-soft disabled:opacity-60 transition-colors">
                {saving ? "Saving…" : "💊 Save & Print Prescription"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
