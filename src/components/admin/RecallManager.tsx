"use client";

import { useState, useEffect } from "react";

type PatientPreview = {
  phone: string;
  name: string;
  lastRecallAt: string | null;
  lastSeen: string;
};

type BirthdayPreview = {
  phone: string;
  name: string;
  dob: string | null;
};

export function RecallManager() {
  const [recallPatients, setRecallPatients] = useState<PatientPreview[]>([]);
  const [birthdayPatients, setBirthdayPatients] = useState<BirthdayPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runBirthday, setRunBirthday] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [recallRes, bdRes] = await Promise.all([
      fetch("/api/admin/recall"),
      fetch("/api/admin/birthday"),
    ]);
    if (recallRes.ok) {
      const data = await recallRes.json();
      setRecallPatients(data.patients ?? []);
    }
    if (bdRes.ok) {
      const data = await bdRes.json();
      setBirthdayPatients(data.patients ?? []);
    }
    setLoading(false);
  }

  async function handleRunRecall() {
    if (!confirm(`Send recall WhatsApp to ${recallPatients.length} patients?`)) return;
    setRunning(true);
    const res = await fetch("/api/admin/recall?manual", { method: "POST" });
    const data = await res.json();
    setLastResult(`✅ Recall sent to ${data.sent} patients`);
    await load();
    setRunning(false);
  }

  async function handleRunBirthday() {
    if (!birthdayPatients.length) return;
    setRunBirthday(true);
    const res = await fetch("/api/admin/birthday?manual", { method: "POST" });
    const data = await res.json();
    setLastResult(`🎂 Birthday WhatsApp sent to ${data.sent} patients`);
    await load();
    setRunBirthday(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">🔄 Recall & Birthday System</h2>
        <p className="text-sm text-muted mt-1">Automated patient outreach — recall inactive patients and wish them on birthdays.</p>
      </div>

      {lastResult && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-800">
          {lastResult}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recall Card */}
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-navy">📨 Patient Recall</h3>
                <p className="text-xs text-muted mt-1">Patients not seen in 6+ months</p>
              </div>
              <span className="text-3xl font-bold text-navy">{recallPatients.length}</span>
            </div>

            <div className="rounded-xl bg-blue/5 border border-blue/20 px-4 py-3 mb-4">
              <p className="text-xs text-navy leading-relaxed">
                <strong>Automation:</strong> GitHub Actions runs this monthly (1st of each month at 9 AM IST).
                Use "Run Now" to send immediately.
              </p>
            </div>

            {recallPatients.length > 0 && (
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {recallPatients.map((p) => (
                  <div key={p.phone} className="flex items-center justify-between text-sm py-1.5 border-b border-line last:border-0">
                    <div>
                      <span className="font-medium text-navy">{p.name}</span>
                      <span className="text-muted ml-2 text-xs">{p.phone}</span>
                    </div>
                    <span className="text-xs text-muted">
                      Last seen: {new Date(p.lastSeen).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {recallPatients.length === 0 ? (
              <div className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
                ✅ All patients have been seen recently. No recalls due.
              </div>
            ) : (
              <button
                onClick={handleRunRecall}
                disabled={running}
                className="w-full rounded-xl bg-navy py-3 text-sm font-bold text-white hover:bg-navy/80 transition-colors disabled:opacity-50"
              >
                {running ? "Sending..." : `📤 Send Recall to ${recallPatients.length} Patients`}
              </button>
            )}
          </div>

          {/* Birthday Card */}
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-navy">🎂 Birthday Wishes</h3>
                <p className="text-xs text-muted mt-1">Today&apos;s birthdays</p>
              </div>
              <span className="text-3xl font-bold text-navy">{birthdayPatients.length}</span>
            </div>

            <div className="rounded-xl bg-blue/5 border border-blue/20 px-4 py-3 mb-4">
              <p className="text-xs text-navy leading-relaxed">
                <strong>Automation:</strong> GitHub Actions runs at 9 AM IST daily and sends birthday WhatsApps automatically.
                Requires DOB to be saved on the patient record.
              </p>
            </div>

            {birthdayPatients.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {birthdayPatients.map((p) => (
                    <div key={p.phone} className="flex items-center justify-between text-sm py-1.5 border-b border-line last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎂</span>
                        <span className="font-medium text-navy">{p.name}</span>
                        <span className="text-muted text-xs">{p.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleRunBirthday}
                  disabled={runBirthday}
                  className="w-full rounded-xl bg-yellow-500 py-3 text-sm font-bold text-white hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {runBirthday ? "Sending..." : `🎉 Send Birthday Wishes`}
                </button>
              </>
            ) : (
              <div className="text-sm text-muted bg-bg rounded-xl px-4 py-3">
                No birthdays today. Make sure patient DOB is saved in the Patients section.
              </div>
            )}
          </div>
        </div>
      )}

      {/* How to add DOB hint */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-sm font-bold text-navy mb-2">📝 How to add patient DOB</h3>
        <p className="text-xs text-muted leading-relaxed">
          Go to <strong>Patients</strong> → expand a patient → click the DOB field to update it.
          Once a DOB is saved, the daily cron will automatically send a birthday WhatsApp each year.
          Patients can also fill their DOB in their portal Health Info tab.
        </p>
      </div>
    </div>
  );
}
