"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SlotFree = { time: string; state: "free" };
type SlotBlocked = { time: string; state: "blocked"; reason: string };
type SlotBooked = {
  time: string;
  state: "booked";
  lead: { id: string; name: string; phone: string; treatment: string; status: string };
};
type Slot = SlotFree | SlotBlocked | SlotBooked;

function todayStr() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function addDays(dateStr: string, n: number) {
  const d = new Date(`${dateStr}T12:00:00+05:30`);
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function formatDateLabel(dateStr: string) {
  const d = new Date(`${dateStr}T12:00:00+05:30`);
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-600",
};

export function CalendarView() {
  const router = useRouter();
  const [date, setDate] = useState(todayStr());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [role, setRole] = useState<string>("assistant");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busyTime, setBusyTime] = useState<string | null>(null);

  async function load(d: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/calendar?date=${d}`);
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSlots(data.slots || []);
      setRole(data.user?.role || "assistant");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally { setLoading(false); }
  }

  useEffect(() => { load(date); }, [date]);

  async function blockSlot(time: string) {
    const reason = prompt(`Reason for blocking ${time} on ${date}? (optional)`) ?? null;
    if (reason === null) return; // cancelled
    setBusyTime(time);
    try {
      await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time, reason }),
      });
      await load(date);
    } finally { setBusyTime(null); }
  }

  async function unblockSlot(time: string) {
    if (!confirm(`Unblock ${time} on ${date}?`)) return;
    setBusyTime(time);
    try {
      await fetch("/api/admin/slots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time }),
      });
      await load(date);
    } finally { setBusyTime(null); }
  }

  const free = slots.filter((s) => s.state === "free").length;
  const booked = slots.filter((s) => s.state === "booked").length;
  const blocked = slots.filter((s) => s.state === "blocked").length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">Calendar</h1>
          <p className="text-xs text-muted mt-0.5">{formatDateLabel(date)}</p>
        </div>
        {/* Date input */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-line px-3 py-2 text-sm font-medium text-navy outline-none focus:border-blue"
        />
      </div>

      {/* Prev / Today / Next */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setDate(addDays(date, -1))}
          className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
        >
          ← Prev day
        </button>
        <button
          onClick={() => setDate(todayStr())}
          className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => setDate(addDays(date, 1))}
          className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
        >
          Next day →
        </button>
      </div>

      {/* Summary pills */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">{free} free</span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">{booked} booked</span>
        <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">{blocked} blocked</span>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <SlotCard
              key={slot.time}
              slot={slot}
              role={role}
              busy={busyTime === slot.time}
              onBlock={() => blockSlot(slot.time)}
              onUnblock={() => unblockSlot(slot.time)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SlotCard({
  slot,
  role,
  busy,
  onBlock,
  onUnblock,
}: {
  slot: Slot;
  role: string;
  busy: boolean;
  onBlock: () => void;
  onUnblock: () => void;
}) {
  const isDoctor = role === "doctor";

  if (slot.state === "booked") {
    return (
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-bold text-amber-900">{slot.time}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${STATUS_BADGE[slot.lead.status] || "bg-gray-100 text-gray-600"}`}>
            {slot.lead.status}
          </span>
        </div>
        <p className="mt-1 text-sm font-semibold text-navy">{slot.lead.name}</p>
        <a href={`tel:${slot.lead.phone}`} className="text-xs text-blue hover:underline">{slot.lead.phone}</a>
        {slot.lead.treatment && <p className="mt-0.5 text-xs text-muted">{slot.lead.treatment}</p>}
      </div>
    );
  }

  if (slot.state === "blocked") {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-3">
        <span className="text-sm font-bold text-red-800">{slot.time}</span>
        <p className="mt-1 text-xs text-red-700">🔒 Blocked{slot.reason ? ` — ${slot.reason}` : ""}</p>
        {isDoctor && (
          <button
            disabled={busy}
            onClick={onUnblock}
            className="mt-2 rounded-full border border-red-300 px-3 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            {busy ? "…" : "Unblock"}
          </button>
        )}
      </div>
    );
  }

  // free
  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <span className="text-sm font-semibold text-navy">{slot.time}</span>
      <p className="mt-1 text-xs text-muted">Free</p>
      {isDoctor && (
        <button
          disabled={busy}
          onClick={onBlock}
          className="mt-2 rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted hover:border-red-300 hover:text-red-700 disabled:opacity-50 transition-colors"
        >
          {busy ? "…" : "Block slot"}
        </button>
      )}
    </div>
  );
}
