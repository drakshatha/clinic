"use client";

import { useState, useEffect } from "react";

type Phase = {
  id?: string;
  phaseNumber: number;
  title: string;
  description: string;
  estimatedCost: number;
  duration: string;
  isCompleted: boolean;
};

type Plan = {
  id: string;
  patientPhone: string;
  title: string;
  notes: string;
  totalCost: number;
  status: string;
  sharedAt: string | null;
  createdAt: string;
  phases: Phase[];
  patient: { name: string; phone: string };
  createdBy: { name: string; role: string };
};

type PatientOption = {
  phone: string;
  name: string;
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  shared: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
};

const emptyPhase = (): Omit<Phase, "id" | "phaseNumber" | "isCompleted"> => ({
  title: "",
  description: "",
  estimatedCost: 0,
  duration: "",
});

export function TreatmentPlanManager() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // New plan form
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    patientPhone: "",
    title: "",
    notes: "",
    phases: [{ ...emptyPhase() }],
  });
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState<string | null>(null);
  const [searchPhone, setSearchPhone] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [plansRes, patientsRes] = await Promise.all([
      fetch("/api/admin/treatment-plans"),
      fetch("/api/admin/patients"),
    ]);
    if (plansRes.ok) setPlans(await plansRes.json());
    if (patientsRes.ok) {
      const data = await patientsRes.json();
      setPatients((data.patients ?? []).map((p: PatientOption) => ({ phone: p.phone, name: p.name })));
    }
    setLoading(false);
  }

  function addPhase() {
    setForm((f) => ({ ...f, phases: [...f.phases, { ...emptyPhase() }] }));
  }

  function removePhase(i: number) {
    setForm((f) => ({ ...f, phases: f.phases.filter((_, idx) => idx !== i) }));
  }

  function updatePhase(i: number, field: string, value: string | number) {
    setForm((f) => {
      const phases = [...f.phases];
      phases[i] = { ...phases[i], [field]: value };
      return { ...f, phases };
    });
  }

  function totalCost() {
    return form.phases.reduce((s, p) => s + (Number(p.estimatedCost) || 0), 0);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patientPhone || !form.title || form.phases.some((p) => !p.title)) return;
    setSaving(true);
    const res = await fetch("/api/admin/treatment-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const plan = await res.json();
      setPlans((prev) => [plan, ...prev]);
      setCreating(false);
      setForm({ patientPhone: "", title: "", notes: "", phases: [{ ...emptyPhase() }] });
    }
    setSaving(false);
  }

  async function handleShare(planId: string) {
    setSharing(planId);
    const res = await fetch(`/api/admin/treatment-plans/${planId}?action=share`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setPlans((prev) => prev.map((p) => p.id === planId ? { ...p, status: "shared" } : p));
      alert(data.sent ? "✅ Plan sent via WhatsApp!" : "📋 Plan shared (WhatsApp API not configured – send manually).");
    }
    setSharing(null);
  }

  async function handleDelete(planId: string) {
    if (!confirm("Delete this treatment plan?")) return;
    const res = await fetch(`/api/admin/treatment-plans/${planId}`, { method: "DELETE" });
    if (res.ok) setPlans((prev) => prev.filter((p) => p.id !== planId));
  }

  async function togglePhase(planId: string, phaseId: string, current: boolean) {
    const res = await fetch(`/api/admin/treatment-plans/${planId}?action=phase-complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phaseId, isCompleted: !current }),
    });
    if (res.ok) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === planId
            ? { ...p, phases: p.phases.map((ph) => ph.id === phaseId ? { ...ph, isCompleted: !current } : ph) }
            : p
        )
      );
    }
  }

  const filtered = searchPhone
    ? plans.filter((p) => p.patient.phone.includes(searchPhone) || p.patient.name.toLowerCase().includes(searchPhone.toLowerCase()))
    : plans;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">📋 Treatment Plans</h2>
          <p className="text-sm text-muted mt-1">Create and share multi-visit treatment plans with cost estimates.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="rounded-xl bg-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
        >
          + New Plan
        </button>
      </div>

      {/* Search */}
      {plans.length > 0 && (
        <input
          type="text"
          placeholder="Search by patient name or phone..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
        />
      )}

      {/* New Plan Form */}
      {creating && (
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="text-lg font-bold text-navy mb-4">New Treatment Plan</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Patient</label>
                <select
                  value={form.patientPhone}
                  onChange={(e) => setForm((f) => ({ ...f, patientPhone: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue/30"
                >
                  <option value="">Select patient...</option>
                  {patients.map((p) => (
                    <option key={p.phone} value={p.phone}>{p.name} ({p.phone})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Plan Title</label>
                <input
                  type="text"
                  placeholder="e.g. Full Mouth Rehabilitation"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">Doctor&apos;s Notes</label>
              <textarea
                placeholder="Overall notes or patient condition details..."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30 resize-none"
              />
            </div>

            {/* Phases */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-muted uppercase">Treatment Phases</label>
                <button type="button" onClick={addPhase} className="text-xs font-semibold text-blue hover:underline">
                  + Add Phase
                </button>
              </div>
              <div className="space-y-3">
                {form.phases.map((phase, i) => (
                  <div key={i} className="rounded-xl border border-line bg-bg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-navy bg-navy/10 px-2.5 py-1 rounded-full">Phase {i + 1}</span>
                      {form.phases.length > 1 && (
                        <button type="button" onClick={() => removePhase(i)} className="text-xs text-red-500 hover:underline">Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Phase title (e.g. Extraction)"
                        value={phase.title}
                        onChange={(e) => updatePhase(i, "title", e.target.value)}
                        required
                        className="rounded-xl border border-line px-3 py-2 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="₹ Cost"
                          value={phase.estimatedCost || ""}
                          onChange={(e) => updatePhase(i, "estimatedCost", parseFloat(e.target.value) || 0)}
                          min={0}
                          className="flex-1 rounded-xl border border-line px-3 py-2 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
                        />
                        <input
                          type="text"
                          placeholder="Duration"
                          value={phase.duration}
                          onChange={(e) => updatePhase(i, "duration", e.target.value)}
                          className="w-28 rounded-xl border border-line px-3 py-2 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
                        />
                      </div>
                      <textarea
                        placeholder="Phase description (optional)"
                        value={phase.description}
                        onChange={(e) => updatePhase(i, "description", e.target.value)}
                        rows={2}
                        className="col-span-2 rounded-xl border border-line px-3 py-2 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between rounded-xl bg-navy/5 px-4 py-3">
              <span className="text-sm font-semibold text-navy">Total Estimated Cost</span>
              <span className="text-xl font-bold text-navy">₹{totalCost().toLocaleString("en-IN")}</span>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-blue py-2.5 text-sm font-bold text-white hover:bg-blue-deep transition-colors disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Plan"}
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

      {/* Plans List */}
      {loading ? (
        <div className="py-12 text-center text-muted">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted">
          {plans.length === 0 ? "No treatment plans yet. Create one above." : "No plans match your search."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-line bg-surface overflow-hidden">
              {/* Plan header */}
              <div
                className="flex items-start justify-between p-5 cursor-pointer hover:bg-bg/50 transition-colors"
                onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STATUS_COLORS[plan.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {plan.status}
                    </span>
                    <h3 className="text-base font-bold text-navy truncate">{plan.title}</h3>
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {plan.patient.name} · {plan.patient.phone}
                    <span className="ml-3 text-xs">by {plan.createdBy.name}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-muted">{plan.phases.length} phase{plan.phases.length !== 1 ? "s" : ""}</span>
                    <span className="text-sm font-bold text-navy">₹{plan.totalCost.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-muted">
                      {plan.phases.filter((p) => p.isCompleted).length}/{plan.phases.length} done
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {plan.status !== "shared" && plan.status !== "accepted" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(plan.id); }}
                      disabled={sharing === plan.id}
                      className="rounded-xl bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {sharing === plan.id ? "..." : "📤 Share"}
                    </button>
                  )}
                  {plan.status === "shared" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(plan.id); }}
                      disabled={sharing === plan.id}
                      className="rounded-xl bg-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-deep transition-colors disabled:opacity-50"
                    >
                      {sharing === plan.id ? "..." : "↩ Resend"}
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}
                    className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                  <span className="text-muted">{expanded === plan.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded phases */}
              {expanded === plan.id && (
                <div className="border-t border-line px-5 pb-5">
                  {plan.notes && (
                    <div className="mt-4 rounded-xl bg-navy/5 px-4 py-3 text-sm text-navy">
                      📝 {plan.notes}
                    </div>
                  )}
                  <div className="mt-4 space-y-3">
                    {plan.phases.map((phase) => (
                      <div
                        key={phase.id}
                        className={`rounded-xl border p-4 transition-colors ${phase.isCompleted ? "border-green-200 bg-green-50" : "border-line bg-bg"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <button
                              onClick={() => phase.id && togglePhase(plan.id, phase.id, phase.isCompleted)}
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                phase.isCompleted
                                  ? "border-green-600 bg-green-600 text-white"
                                  : "border-gray-300 hover:border-green-500"
                              }`}
                            >
                              {phase.isCompleted && "✓"}
                            </button>
                            <div>
                              <div className={`text-sm font-bold ${phase.isCompleted ? "text-green-800 line-through" : "text-navy"}`}>
                                Phase {phase.phaseNumber}: {phase.title}
                              </div>
                              {phase.description && (
                                <div className="text-xs text-muted mt-0.5">{phase.description}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-navy">₹{phase.estimatedCost.toLocaleString("en-IN")}</div>
                            {phase.duration && <div className="text-xs text-muted mt-0.5">{phase.duration}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-navy/5 px-4 py-3">
                    <span className="text-sm font-semibold text-navy">Total Estimated</span>
                    <span className="text-lg font-bold text-navy">₹{plan.totalCost.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
