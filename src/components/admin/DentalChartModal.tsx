"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── FDI adult dentition ────────────────────────────────────────────────────────
// Upper: R→center  18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28  center→L
// Lower: R→center  48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38  center→L

const UPPER = [18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28] as const;
const LOWER = [48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38] as const;
const ALL_TEETH = [...UPPER, ...LOWER];

type Condition =
  | "healthy" | "cavity" | "filling" | "crown"
  | "implant" | "missing" | "root_canal"
  | "extraction_needed" | "bridge" | "veneer";

type TeethMap = Partial<Record<number, Condition>>;

// ── Condition meta ─────────────────────────────────────────────────────────────
const CONDITIONS: { value: Condition; label: string; color: string; bg: string; icon: string }[] = [
  { value: "healthy",            label: "Healthy",            color: "#16a34a", bg: "#dcfce7", icon: "✓" },
  { value: "cavity",             label: "Cavity",             color: "#dc2626", bg: "#fee2e2", icon: "C" },
  { value: "filling",            label: "Filling",            color: "#d97706", bg: "#fef3c7", icon: "F" },
  { value: "crown",              label: "Crown",              color: "#2563eb", bg: "#dbeafe", icon: "K" },
  { value: "implant",            label: "Implant",            color: "#0d9488", bg: "#ccfbf1", icon: "I" },
  { value: "missing",            label: "Missing",            color: "#6b7280", bg: "#f3f4f6", icon: "✕" },
  { value: "root_canal",         label: "Root Canal",         color: "#7c3aed", bg: "#ede9fe", icon: "R" },
  { value: "extraction_needed",  label: "Extract",            color: "#c2410c", bg: "#ffedd5", icon: "E" },
  { value: "bridge",             label: "Bridge",             color: "#1d4ed8", bg: "#bfdbfe", icon: "B" },
  { value: "veneer",             label: "Veneer",             color: "#0e7490", bg: "#cffafe", icon: "V" },
];

function conditionMeta(c: Condition | undefined) {
  if (!c || c === "healthy") return CONDITIONS[0];
  return CONDITIONS.find((x) => x.value === c) ?? CONDITIONS[0];
}

// Molars are wider teeth, canines pointier — we use relative widths
function toothWidth(n: number): number {
  const last = n % 10;
  if (last >= 6) return 36; // molars
  if (last === 5) return 30; // 2nd premolar
  if (last === 4) return 28; // 1st premolar
  if (last === 3) return 26; // canine
  return 22;                  // incisors
}

// ── Single tooth cell ──────────────────────────────────────────────────────────
function Tooth({
  number,
  condition,
  onClick,
}: {
  number: number;
  condition?: Condition;
  onClick: (n: number, e: React.MouseEvent) => void;
}) {
  const meta = conditionMeta(condition);
  const w = toothWidth(number);

  return (
    <button
      title={`#${number} — ${meta.label}`}
      onClick={(e) => onClick(number, e)}
      style={{ width: w, flexShrink: 0 }}
      className="flex flex-col items-center gap-0.5 group"
    >
      {/* Crown */}
      <div
        style={{
          width: w - 2,
          height: 28,
          background: meta.bg,
          borderColor: meta.color,
          borderWidth: 2,
          borderStyle: "solid",
          borderRadius: "6px 6px 3px 3px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 800,
          color: meta.color,
          transition: "transform .1s",
        }}
        className="group-hover:scale-110"
      >
        {condition && condition !== "healthy" ? meta.icon : ""}
      </div>
      {/* Root */}
      <div
        style={{
          width: (w - 2) * 0.55,
          height: 14,
          background: meta.bg,
          borderColor: meta.color,
          borderWidth: 2,
          borderStyle: "solid",
          borderRadius: "0 0 6px 6px",
          borderTop: "none",
        }}
      />
      {/* Number */}
      <span style={{ fontSize: 9, color: "#888", fontWeight: 600, lineHeight: 1 }}>{number}</span>
    </button>
  );
}

// ── Popover ───────────────────────────────────────────────────────────────────
function ConditionPopover({
  toothNumber,
  current,
  position,
  onSelect,
  onClose,
}: {
  toothNumber: number;
  current?: Condition;
  position: { x: number; y: number };
  onSelect: (c: Condition) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Keep popover inside viewport
  const style: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    top: position.y + 10,
    left: position.x,
    transform: "translateX(-50%)",
  };

  return (
    <div ref={ref} style={style}
      className="rounded-2xl border border-line bg-white shadow-[0_8px_32px_rgba(0,0,0,.18)] p-3 w-56">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-2">Tooth #{toothNumber}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {CONDITIONS.map((c) => (
          <button
            key={c.value}
            onClick={() => onSelect(c.value)}
            style={{ background: c.bg, borderColor: c.color, color: c.color }}
            className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left transition-opacity ${
              current === c.value ? "ring-2 ring-offset-1" : "hover:opacity-80"
            }`}
          >
            <span className="w-4 text-center text-xs font-black">{c.icon}</span>
            <span className="text-[11px] font-semibold truncate">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function DentalChartModal({
  patientPhone,
  patientName,
  onClose,
}: {
  patientPhone: string;
  patientName: string;
  onClose: () => void;
}) {
  const [teeth, setTeeth] = useState<TeethMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [popover, setPopover] = useState<{ tooth: number; x: number; y: number } | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  // Load existing chart
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dental-chart?phone=${encodeURIComponent(patientPhone)}`);
      const d = await res.json();
      setTeeth(d.teeth ?? {});
      setUpdatedAt(d.updatedAt);
    } finally {
      setLoading(false);
    }
  }, [patientPhone]);

  useEffect(() => { load(); }, [load]);

  function handleToothClick(n: number, e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopover({ tooth: n, x: rect.left + rect.width / 2, y: rect.bottom });
  }

  function applyCondition(c: Condition) {
    if (!popover) return;
    setTeeth((prev) => {
      if (c === "healthy") {
        const next = { ...prev };
        delete next[popover.tooth];
        return next;
      }
      return { ...prev, [popover.tooth]: c };
    });
    setPopover(null);
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/dental-chart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: patientPhone, teeth }),
      });
      setSaved(true);
      setUpdatedAt(new Date().toISOString());
    } finally {
      setSaving(false);
    }
  }

  function clearAll() {
    if (confirm("Clear all markings on this chart?")) {
      setTeeth({});
      setSaved(false);
    }
  }

  // Count conditions for summary
  const summary = CONDITIONS.filter((c) => c.value !== "healthy").map((c) => ({
    ...c,
    count: ALL_TEETH.filter((n) => teeth[n] === c.value).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-6 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,0,0,.2)] my-auto">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-line px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-navy">🦷 Dental Chart</h2>
            <p className="text-xs text-muted mt-0.5">{patientName} · {patientPhone}</p>
            {updatedAt && (
              <p className="text-[10px] text-muted mt-0.5">
                Last updated: {new Date(updatedAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy rounded-full p-1.5 hover:bg-bg-soft transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted text-sm">Loading chart…</div>
          ) : (
            <>
              {/* ── Upper jaw ── */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted text-center mb-2">Upper Jaw (Maxilla)</p>
              <div className="flex justify-center gap-0.5 mb-1">
                {UPPER.map((n) => (
                  <Tooth key={n} number={n} condition={teeth[n]} onClick={handleToothClick} />
                ))}
              </div>

              {/* Midline */}
              <div className="relative my-2 flex items-center justify-center gap-2">
                <div className="flex-1 border-t border-dashed border-line" />
                <span className="text-[10px] text-muted font-semibold px-2 bg-white">← Right · Left →</span>
                <div className="flex-1 border-t border-dashed border-line" />
              </div>

              {/* ── Lower jaw ── */}
              <div className="flex justify-center gap-0.5 mt-1">
                {LOWER.map((n) => (
                  <Tooth key={n} number={n} condition={teeth[n]} onClick={handleToothClick} />
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted text-center mt-2">Lower Jaw (Mandible)</p>

              {/* Legend */}
              <div className="mt-5 flex flex-wrap gap-1.5 justify-center">
                {CONDITIONS.map((c) => (
                  <span key={c.value}
                    style={{ background: c.bg, color: c.color, borderColor: c.color }}
                    className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                    <span>{c.icon}</span> {c.label}
                  </span>
                ))}
              </div>

              {/* Summary */}
              {summary.length > 0 && (
                <div className="mt-4 rounded-xl bg-bg-soft p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-2">Chart Summary</p>
                  <div className="flex flex-wrap gap-2">
                    {summary.map((s) => (
                      <span key={s.value}
                        style={{ background: s.bg, color: s.color }}
                        className="rounded-full px-2.5 py-1 text-xs font-bold">
                        {s.count} × {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-line px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <button onClick={clearAll} className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors">
            🗑 Clear all
          </button>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-muted hover:bg-bg-soft transition-colors">
              Close
            </button>
            <button onClick={save} disabled={saving || loading}
              className="rounded-full bg-navy px-5 py-2 text-sm font-bold text-white hover:bg-navy-soft disabled:opacity-60 transition-colors">
              {saving ? "Saving…" : saved ? "✓ Saved" : "💾 Save Chart"}
            </button>
          </div>
        </div>
      </div>

      {/* Condition popover */}
      {popover && (
        <ConditionPopover
          toothNumber={popover.tooth}
          current={teeth[popover.tooth]}
          position={{ x: popover.x, y: popover.y }}
          onSelect={applyCondition}
          onClose={() => setPopover(null)}
        />
      )}
    </div>
  );
}
