"use client";

import { useEffect, useState } from "react";
import { formatSlotLabel } from "@/lib/time";

type LeadPreview = {
  id: string;
  name: string;
  slotDate: string;
  slotTime: string;
  diffH: number;
  reminder24hSent: boolean;
  reminder1hSent: boolean;
};

export function RemindersManager() {
  const [leads, setLeads] = useState<LeadPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/reminders-preview");
    const d = await r.json();
    setLeads(d.leads ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function triggerNow() {
    setTriggering(true);
    setTriggerResult(null);
    const r = await fetch("/api/admin/reminders-run", { method: "POST" });
    const d = await r.json();
    setTriggerResult(`Sent ${d.reminders?.length ?? 0} reminder(s)`);
    setTriggering(false);
    load();
  }

  const upcoming = leads.filter((l) => l.diffH >= 0);
  const past = leads.filter((l) => l.diffH < 0);

  return (
    <div className="space-y-6">
      {/* Info box */}
      <div className="rounded-2xl border border-blue/20 bg-blue/5 p-5">
        <h3 className="font-semibold text-navy mb-1">🤖 Automated Reminders</h3>
        <p className="text-sm text-muted">
          GitHub Actions runs this automatically every hour. Patients with confirmed appointments receive:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>📅 <strong>24h before</strong> — "Your appointment is tomorrow…"</li>
          <li>⏰ <strong>1h before</strong> — "Your appointment is in 1 hour…"</li>
        </ul>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={triggerNow}
            disabled={triggering}
            className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {triggering ? "Running…" : "▶ Run Now"}
          </button>
          {triggerResult && (
            <span className="text-sm font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-1.5">
              ✓ {triggerResult}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted">Loading…</div>
      ) : (
        <>
          {/* Upcoming confirmed appointments */}
          <div className="rounded-2xl border border-line bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-line">
              <h2 className="font-semibold text-navy">Upcoming Confirmed Appointments</h2>
            </div>
            {upcoming.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted text-center">No upcoming confirmed appointments.</p>
            ) : (
              <div className="divide-y divide-line">
                {upcoming.map((l) => (
                  <ReminderRow key={l.id} lead={l} />
                ))}
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div className="rounded-2xl border border-line bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-line">
                <h2 className="font-semibold text-navy text-sm">Past (awaiting payment/completion)</h2>
              </div>
              <div className="divide-y divide-line">
                {past.map((l) => (
                  <ReminderRow key={l.id} lead={l} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReminderRow({ lead }: { lead: LeadPreview }) {
  const slotLabel = formatSlotLabel(lead.slotDate, lead.slotTime);
  const diffLabel =
    lead.diffH < 0
      ? `${Math.abs(Math.round(lead.diffH))}h ago`
      : lead.diffH < 1
      ? `in ${Math.round(lead.diffH * 60)}min`
      : `in ${Math.round(lead.diffH)}h`;

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-navy text-sm">{lead.name}</p>
        <p className="text-xs text-muted">{slotLabel} · {diffLabel}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge sent={lead.reminder24hSent} label="24h" />
        <Badge sent={lead.reminder1hSent} label="1h" />
      </div>
    </div>
  );
}

function Badge({ sent, label }: { sent: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
        sent ? "bg-green-100 text-green-700" : "bg-bg-soft text-muted"
      }`}
    >
      {label} {sent ? "✓" : "–"}
    </span>
  );
}
