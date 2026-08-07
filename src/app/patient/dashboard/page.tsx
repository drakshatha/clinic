"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { site } from "@/lib/site";

type Appointment = {
  id: string;
  slotDate: string;
  slotTime: string;
  treatment: string;
  status: string;
  message: string;
};

type HistoryEntry = {
  id: string;
  visitType: string;
  treatmentDone: string;
  notes: string;
  nextVisitDate: string | null;
  completedAt: string;
  paymentMode: string | null;
  paymentAmount: number | null;
};

type MedicalHistory = {
  bloodGroup: string;
  allergies: string;
  currentMedications: string;
  medicalConditions: string;
  smokingStatus: string;
  isPregnant: string;
  dentalConcerns: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};

type TreatmentPhase = {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  estimatedCost: number;
  duration: string;
  isCompleted: boolean;
};

type TreatmentPlan = {
  id: string;
  title: string;
  notes: string;
  totalCost: number;
  status: string;
  sharedAt: string | null;
  phases: TreatmentPhase[];
  createdBy: { name: string; role: string };
};

type Patient = { phone: string; name: string; email: string; dob?: string | null };

const STATUS_BADGE: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-700",
  no_show:   "bg-gray-100 text-gray-600",
  followup:  "bg-purple-100 text-purple-800",
};

const STATUS_LABEL: Record<string, string> = {
  pending:   "⏳ Pending",
  confirmed: "✅ Confirmed",
  completed: "🏁 Completed",
  cancelled: "❌ Cancelled",
  no_show:   "🚫 No-show",
  followup:  "🔁 Follow-up",
};

const VISIT_LABEL: Record<string, string> = {
  consultation: "Consultation",
  treatment:    "Treatment",
  followup:     "Follow-up",
  resolved:     "Case Resolved",
};

const EMPTY_HEALTH: MedicalHistory = {
  bloodGroup: "",
  allergies: "",
  currentMedications: "",
  medicalConditions: "",
  smokingStatus: "",
  isPregnant: "",
  dentalConcerns: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export default function PatientDashboard() {
  const router = useRouter();
  const [patient,      setPatient]      = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [history,      setHistory]      = useState<HistoryEntry[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState<"upcoming" | "history" | "plans" | "health">("upcoming");

  // Health form state
  const [health,        setHealth]        = useState<MedicalHistory>(EMPTY_HEALTH);
  const [dob,           setDob]           = useState("");
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthSaving,  setHealthSaving]  = useState(false);
  const [healthSaved,   setHealthSaved]   = useState(false);

  // Treatment plans state
  const [plans,        setPlans]        = useState<TreatmentPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);

  useEffect(() => {
    fetch("/api/patient/me")
      .then((r) => {
        if (r.status === 401) { router.push("/patient"); return null; }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setPatient(d.patient);
        setAppointments(d.appointments);
        setHistory(d.history);
      })
      .catch(() => router.push("/patient"))
      .finally(() => setLoading(false));
  }, [router]);

  // Load health info when switching to health tab
  useEffect(() => {
    if (tab !== "health") return;
    setHealthLoading(true);
    fetch("/api/patient/health")
      .then((r) => r.json())
      .then((d) => {
        if (d.history) setHealth({ ...EMPTY_HEALTH, ...d.history });
        if (d.dob) setDob(d.dob);
      })
      .finally(() => setHealthLoading(false));
  }, [tab]);

  // Load treatment plans when switching to plans tab
  useEffect(() => {
    if (tab !== "plans") return;
    setPlansLoading(true);
    fetch("/api/patient/treatment-plans")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setPlans(d); })
      .finally(() => setPlansLoading(false));
  }, [tab]);

  async function saveHealth(e: React.FormEvent) {
    e.preventDefault();
    setHealthSaving(true);
    setHealthSaved(false);
    await fetch("/api/patient/health", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...health, dob }),
    });
    setHealthSaving(false);
    setHealthSaved(true);
    setTimeout(() => setHealthSaved(false), 3000);
  }

  async function logout() {
    await fetch("/api/patient/logout", { method: "POST" });
    router.push("/patient");
  }

  const today = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
  const upcoming = appointments.filter(
    (a) => a.slotDate >= today && !["cancelled","no_show","completed"].includes(a.status)
  );
  const past = appointments.filter(
    (a) => a.slotDate < today || ["completed","cancelled","no_show"].includes(a.status)
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-pulse">🦷</div>
          <p className="text-sm text-muted">Loading your records…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[min(640px,100%-2rem)] py-8 space-y-6">

      {/* Welcome header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue">Welcome back</p>
          <h1 className="text-2xl font-bold text-navy mt-0.5">
            {patient?.name || "Patient"}
          </h1>
          <p className="text-sm text-muted mt-1">{patient?.phone}</p>
        </div>
        <button
          onClick={logout}
          className="flex-shrink-0 rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-muted hover:text-red-600 hover:border-red-200 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Visits", value: appointments.length },
          { label: "Upcoming", value: upcoming.length },
          { label: "Completed", value: history.length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4 text-center shadow-[var(--shadow-sm)]">
            <p className="text-2xl font-bold text-navy">{s.value}</p>
            <p className="text-[11px] text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Book new */}
      <Link
        href="/contact#book"
        className="flex items-center justify-between rounded-2xl bg-blue px-5 py-4 text-white hover:bg-blue-deep transition-colors"
      >
        <div>
          <p className="text-sm font-bold">Book New Appointment</p>
          <p className="text-xs text-white/70 mt-0.5">Open daily 11 AM – 9:30 PM</p>
        </div>
        <span className="text-xl">→</span>
      </Link>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-bg p-1 overflow-x-auto">
        {(["upcoming", "history", "plans", "health"] as const).map((t) => {
          const labels: Record<string, string> = {
            upcoming: `📅 (${upcoming.length})`,
            history:  `📋 History`,
            plans:    `💊 Plans`,
            health:   `🏥 Health`,
          };
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 whitespace-nowrap rounded-lg py-2 px-2 text-xs font-semibold transition-colors ${
                tab === t ? "bg-white text-navy shadow-sm" : "text-muted hover:text-navy"
              }`}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* ── Upcoming tab ── */}
      {tab === "upcoming" && (
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-sm font-semibold text-navy">No upcoming appointments</p>
              <p className="text-xs text-muted mt-1">Book one above</p>
            </div>
          ) : upcoming.map((a) => (
            <div key={a.id} className="rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-sm)]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-navy">{a.slotDate} · {a.slotTime}</p>
                  {a.treatment && <p className="text-sm text-muted mt-0.5">{a.treatment}</p>}
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_BADGE[a.status] || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABEL[a.status] || a.status}
                </span>
              </div>
              {a.status === "confirmed" && (
                <a
                  href={`https://wa.me/${site.whatsapp}?text=Hi%2C+my+appointment+is+on+${a.slotDate}+at+${encodeURIComponent(a.slotTime)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-100 transition-colors"
                >
                  💬 Message on WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── History tab ── */}
      {tab === "history" && (
        <div className="space-y-3">
          {history.length === 0 && past.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm font-semibold text-navy">No visit history yet</p>
            </div>
          ) : (
            <>
              {history.map((h) => (
                <div key={h.id} className="rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-sm)]">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wide text-blue">
                        {VISIT_LABEL[h.visitType] || h.visitType}
                      </span>
                      <p className="text-xs text-muted mt-0.5">
                        {new Date(h.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    {h.paymentAmount && (
                      <span className="text-sm font-bold text-navy">₹{h.paymentAmount.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                  {h.treatmentDone && (
                    <p className="text-sm text-navy font-semibold">{h.treatmentDone}</p>
                  )}
                  {h.notes && (
                    <p className="text-xs text-muted mt-1 leading-relaxed">{h.notes}</p>
                  )}
                  {h.nextVisitDate && (
                    <p className="mt-2 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg px-2 py-1">
                      🔁 Next visit: {h.nextVisitDate}
                    </p>
                  )}
                </div>
              ))}
              {past.filter((a) => a.status === "no_show" || a.status === "cancelled").map((a) => (
                <div key={a.id} className="rounded-2xl border border-line bg-white p-4 opacity-60">
                  <p className="text-sm font-semibold text-navy">{a.slotDate} · {a.slotTime}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_BADGE[a.status] || "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABEL[a.status] || a.status}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Treatment Plans tab ── */}
      {tab === "plans" && (
        <div className="space-y-4">
          {plansLoading ? (
            <div className="py-8 text-center text-muted text-sm">Loading…</div>
          ) : plans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm font-semibold text-navy">No treatment plans yet</p>
              <p className="text-xs text-muted mt-1">
                Your doctor will share your treatment plan here once it&apos;s ready.
              </p>
            </div>
          ) : plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-navy">{plan.title}</h3>
                  <p className="text-xs text-muted mt-0.5">by {plan.createdBy.name}</p>
                  {plan.notes && <p className="text-xs text-navy mt-2 leading-relaxed bg-navy/5 rounded-lg px-3 py-2">{plan.notes}</p>}
                </div>
                <span className="text-lg font-bold text-navy shrink-0">
                  ₹{plan.totalCost.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Phases */}
              <div className="space-y-2">
                {plan.phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`rounded-xl p-3 ${phase.isCompleted ? "bg-green-50 border border-green-200" : "bg-bg border border-line"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg ${phase.isCompleted ? "text-green-600" : "text-muted"}`}>
                          {phase.isCompleted ? "✅" : "○"}
                        </span>
                        <div>
                          <p className={`text-sm font-semibold ${phase.isCompleted ? "text-green-800 line-through" : "text-navy"}`}>
                            Phase {phase.phaseNumber}: {phase.title}
                          </p>
                          {phase.description && (
                            <p className="text-xs text-muted mt-0.5">{phase.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-navy">₹{phase.estimatedCost.toLocaleString("en-IN")}</p>
                        {phase.duration && <p className="text-xs text-muted">{phase.duration}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-navy/5 px-4 py-3">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">Total Estimated</span>
                <span className="text-base font-bold text-navy">₹{plan.totalCost.toLocaleString("en-IN")}</span>
              </div>

              <p className="mt-3 text-[11px] text-muted">
                * Costs are estimates. Final amounts may vary based on examination findings.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Health Info tab ── */}
      {tab === "health" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue/20 bg-blue/5 p-4">
            <p className="text-sm text-navy font-semibold">Why we need this 🏥</p>
            <p className="text-xs text-muted mt-1">
              Your medical history helps Dr. Akshatha provide the safest care. Information stays private and is only visible to your care team.
            </p>
          </div>

          {healthLoading ? (
            <div className="py-8 text-center text-muted text-sm">Loading…</div>
          ) : (
            <form onSubmit={saveHealth} className="space-y-4">

              {/* DOB */}
              <HealthField label="Date of Birth" hint="Used for birthday wishes">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue/30"
                />
              </HealthField>

              {/* Blood group */}
              <HealthField label="Blood Group">
                <select
                  value={health.bloodGroup}
                  onChange={(e) => setHealth({ ...health, bloodGroup: e.target.value })}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue/30"
                >
                  <option value="">Select…</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-","Don't know"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </HealthField>

              {/* Allergies */}
              <HealthField label="Allergies" hint="e.g. penicillin, latex, nuts">
                <textarea
                  value={health.allergies}
                  onChange={(e) => setHealth({ ...health, allergies: e.target.value })}
                  rows={2}
                  placeholder="List any known allergies, or write 'None'"
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/30 resize-none"
                />
              </HealthField>

              {/* Current medications */}
              <HealthField label="Current Medications" hint="Include supplements & vitamins">
                <textarea
                  value={health.currentMedications}
                  onChange={(e) => setHealth({ ...health, currentMedications: e.target.value })}
                  rows={2}
                  placeholder="e.g. Metformin 500mg, Aspirin 75mg, or 'None'"
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/30 resize-none"
                />
              </HealthField>

              {/* Medical conditions */}
              <HealthField label="Medical Conditions" hint="Diabetes, BP, thyroid, heart, etc.">
                <textarea
                  value={health.medicalConditions}
                  onChange={(e) => setHealth({ ...health, medicalConditions: e.target.value })}
                  rows={2}
                  placeholder="List any diagnosed conditions, or 'None'"
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/30 resize-none"
                />
              </HealthField>

              {/* Smoking status */}
              <HealthField label="Smoking Status">
                <div className="flex flex-wrap gap-3">
                  {[["never","Never"], ["former","Former smoker"], ["current","Current smoker"]].map(([val, label]) => (
                    <label key={val} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="smoking"
                        value={val}
                        checked={health.smokingStatus === val}
                        onChange={() => setHealth({ ...health, smokingStatus: val })}
                        className="accent-blue"
                      />
                      <span className="text-sm text-navy">{label}</span>
                    </label>
                  ))}
                </div>
              </HealthField>

              {/* Pregnancy */}
              <HealthField label="Are you pregnant?">
                <div className="flex gap-3">
                  {[["na","N/A"], ["no","No"], ["yes","Yes"]].map(([val, label]) => (
                    <label key={val} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="pregnant"
                        value={val}
                        checked={health.isPregnant === val}
                        onChange={() => setHealth({ ...health, isPregnant: val })}
                        className="accent-blue"
                      />
                      <span className="text-sm text-navy">{label}</span>
                    </label>
                  ))}
                </div>
              </HealthField>

              {/* Chief dental concern */}
              <HealthField label="Main Dental Concern" hint="What brings you here?">
                <textarea
                  value={health.dentalConcerns}
                  onChange={(e) => setHealth({ ...health, dentalConcerns: e.target.value })}
                  rows={2}
                  placeholder="e.g. missing teeth, pain, cosmetic improvement…"
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/30 resize-none"
                />
              </HealthField>

              {/* Emergency contact */}
              <div className="rounded-2xl border border-line bg-white p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Emergency Contact</p>
                <div className="grid grid-cols-2 gap-3">
                  <HealthField label="Name">
                    <input
                      type="text"
                      value={health.emergencyContactName}
                      onChange={(e) => setHealth({ ...health, emergencyContactName: e.target.value })}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/30"
                    />
                  </HealthField>
                  <HealthField label="Phone">
                    <input
                      type="tel"
                      value={health.emergencyContactPhone}
                      onChange={(e) => setHealth({ ...health, emergencyContactPhone: e.target.value })}
                      placeholder="10-digit number"
                      className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/30"
                    />
                  </HealthField>
                </div>
              </div>

              {/* Save */}
              <button
                type="submit"
                disabled={healthSaving}
                className="w-full rounded-2xl bg-blue py-3 text-sm font-bold text-white hover:opacity-90 transition disabled:opacity-50"
              >
                {healthSaving ? "Saving…" : "Save Health Info"}
              </button>
              {healthSaved && (
                <p className="text-center text-sm font-semibold text-green-700">✓ Saved successfully!</p>
              )}
            </form>
          )}
        </div>
      )}

      {/* Contact strip */}
      <div className="rounded-2xl border border-line bg-bg p-4 text-center">
        <p className="text-xs text-muted">Questions? Call or WhatsApp the clinic</p>
        <a href={`tel:${site.phone}`} className="mt-1 block text-sm font-bold text-navy hover:text-blue">
          {site.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

function HealthField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-navy">
        {label}
        {hint && <span className="ml-1 font-normal text-muted">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
