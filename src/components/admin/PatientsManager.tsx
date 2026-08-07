"use client";

import { useEffect, useState, useCallback } from "react";

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
} | null;

type Patient = {
  id: string;
  phone: string;
  name: string;
  email: string;
  lastSeen: string;
  leads: { id: string; status: string; slotDate: string; treatment: string }[];
  consultations: { id: string; paymentAmount: number | null; visitType: string }[];
  medicalHistory: MedicalHistory;
};

function MHRow({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={`rounded-lg bg-white border border-line px-2.5 py-1.5 ${span ? "col-span-2" : ""}`}>
      <span className="text-muted">{label}: </span>
      <span className="text-navy font-medium">{value}</span>
    </div>
  );
}

export function PatientsManager() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/patients");
    const d   = await res.json();
    setPatients(d.patients || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  const totalRevenue = (p: Patient) =>
    p.consultations.reduce((sum, c) => sum + (c.paymentAmount || 0), 0);

  return (
    <div className="mx-auto w-[min(900px,100%)] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-navy">Patients</h1>
          <p className="text-xs text-muted mt-0.5">
            {patients.length} patients in database
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or phone…"
          className="rounded-xl border border-line px-3 py-2 text-sm text-navy outline-none focus:border-blue w-56"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map((i) => (
            <div key={i} className="h-16 rounded-2xl border border-line bg-white animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
          {search ? "No patients match your search." : "No patients yet."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => {
            const isOpen = expanded === p.id;
            const revenue = totalRevenue(p);
            const lastDate = p.leads[0]?.slotDate ?? "—";
            const completed = p.leads.filter((l) => l.status === "completed").length;

            return (
              <div key={p.id} className="rounded-2xl border border-line bg-white overflow-hidden">
                {/* Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-bg/50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center text-blue font-bold text-sm">
                    {p.name ? p.name[0].toUpperCase() : "?"}
                  </div>

                  {/* Name + phone */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy truncate">
                      {p.name || <span className="text-muted italic">No name</span>}
                    </p>
                    <p className="text-xs text-muted">{p.phone}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6 text-right flex-shrink-0">
                    <div>
                      <p className="text-sm font-bold text-navy">{p.leads.length}</p>
                      <p className="text-[11px] text-muted">Visits</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">{completed}</p>
                      <p className="text-[11px] text-muted">Done</p>
                    </div>
                    {revenue > 0 && (
                      <div>
                        <p className="text-sm font-bold text-navy">₹{revenue.toLocaleString("en-IN")}</p>
                        <p className="text-[11px] text-muted">Revenue</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted">{lastDate}</p>
                      <p className="text-[11px] text-muted">Last appt</p>
                    </div>
                  </div>

                  <span className="text-muted text-sm flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-line px-4 pb-4 pt-3 bg-bg/30">
                    <div className="flex flex-wrap gap-4 text-xs mb-3">
                      {p.email && <span className="text-muted">📧 {p.email}</span>}
                      <a href={`tel:${p.phone}`} className="text-blue hover:underline">📞 Call</a>
                      <a
                        href={`https://wa.me/${p.phone.replace(/\D/g,"")}?text=Hi+${encodeURIComponent(p.name)}%2C+this+is+Akshatha+Dental+Clinic.`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-green-700 hover:underline"
                      >
                        💬 WhatsApp
                      </a>
                    </div>

                    {/* Appointment list */}
                    {p.leads.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-muted mb-1">Appointments</p>
                        {p.leads.map((l) => (
                          <div key={l.id} className="flex items-center gap-3 rounded-xl bg-white border border-line px-3 py-2">
                            <span className="text-xs text-muted w-24 flex-shrink-0">{l.slotDate}</span>
                            <span className="flex-1 text-xs text-navy truncate">{l.treatment || "—"}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              l.status === "completed" ? "bg-blue-100 text-blue-800"
                              : l.status === "confirmed" ? "bg-green-100 text-green-800"
                              : l.status === "cancelled" ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                            }`}>
                              {l.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Medical history */}
                    {p.medicalHistory && (
                      <div className="mt-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-muted mb-2">🏥 Medical History</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {p.medicalHistory.bloodGroup && <MHRow label="Blood Group" value={p.medicalHistory.bloodGroup} />}
                          {p.medicalHistory.allergies && <MHRow label="Allergies" value={p.medicalHistory.allergies} />}
                          {p.medicalHistory.currentMedications && <MHRow label="Medications" value={p.medicalHistory.currentMedications} />}
                          {p.medicalHistory.medicalConditions && <MHRow label="Conditions" value={p.medicalHistory.medicalConditions} />}
                          {p.medicalHistory.smokingStatus && <MHRow label="Smoking" value={p.medicalHistory.smokingStatus} />}
                          {p.medicalHistory.isPregnant && p.medicalHistory.isPregnant !== "na" && <MHRow label="Pregnant" value={p.medicalHistory.isPregnant} />}
                          {p.medicalHistory.dentalConcerns && <MHRow label="Concern" value={p.medicalHistory.dentalConcerns} span />}
                          {p.medicalHistory.emergencyContactName && (
                            <MHRow label="Emergency Contact" value={`${p.medicalHistory.emergencyContactName} ${p.medicalHistory.emergencyContactPhone}`} span />
                          )}
                        </div>
                      </div>
                    )}
                    {!p.medicalHistory && (
                      <p className="mt-3 text-xs text-muted italic">No medical history on file (patient hasn&apos;t filled the intake form yet).</p>
                    )}
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
