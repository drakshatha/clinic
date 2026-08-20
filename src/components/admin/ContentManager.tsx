"use client";

import { useEffect, useState, useCallback } from "react";
import { DEFAULT_FAQS } from "@/lib/content-defaults";
import { services as STATIC_SERVICES } from "@/lib/site";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
type Step = { title: string; body: string };
type FaqItem = { q: string; a: string };

type ServiceRow = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  benefits: string[];
  steps: Step[];
  faqs: FaqItem[];
  startingFrom: string;
  keywords: string[];
};

type SiteFaqRow = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
};

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function parseJson<T>(raw: unknown, fallback: T): T {
  if (Array.isArray(raw)) return raw as T;
  try {
    return JSON.parse(String(raw));
  } catch {
    return fallback;
  }
}

function rowToService(r: Record<string, unknown>): ServiceRow {
  return {
    slug: String(r.slug ?? ""),
    title: String(r.title ?? ""),
    shortTitle: String(r.shortTitle ?? ""),
    summary: String(r.summary ?? ""),
    description: String(r.description ?? ""),
    benefits: parseJson<string[]>(r.benefits, []),
    steps: parseJson<Step[]>(r.steps, []),
    faqs: parseJson<FaqItem[]>(r.faqs, []),
    startingFrom: String(r.startingFrom ?? ""),
    keywords: parseJson<string[]>(r.keywords, []),
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-component: editable list of strings
// ──────────────────────────────────────────────────────────────────────────────
function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  function update(i: number, val: string) {
    const next = [...items];
    next[i] = val;
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-navy">{label}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="text-xs font-semibold text-blue hover:underline"
        >
          + Add item
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-component: editable steps list
// ──────────────────────────────────────────────────────────────────────────────
function StepsEditor({ steps, onChange }: { steps: Step[]; onChange: (v: Step[]) => void }) {
  function update(i: number, field: keyof Step, val: string) {
    const next = steps.map((s, idx) => (idx === i ? { ...s, [field]: val } : s));
    onChange(next);
  }
  function remove(i: number) {
    onChange(steps.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-navy">Procedure Steps</p>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="rounded-xl border border-line bg-bg-soft p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-blue">Step {i + 1}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <input
              value={step.title}
              onChange={(e) => update(i, "title", e.target.value)}
              placeholder="Step title"
              className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm font-semibold outline-none focus:border-blue"
            />
            <textarea
              value={step.body}
              onChange={(e) => update(i, "body", e.target.value)}
              placeholder="Step description"
              rows={2}
              className="w-full resize-y rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...steps, { title: "", body: "" }])}
          className="text-xs font-semibold text-blue hover:underline"
        >
          + Add step
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-component: editable FAQ pairs
// ──────────────────────────────────────────────────────────────────────────────
function FaqPairsEditor({ faqs, onChange }: { faqs: FaqItem[]; onChange: (v: FaqItem[]) => void }) {
  function update(i: number, field: keyof FaqItem, val: string) {
    onChange(faqs.map((f, idx) => (idx === i ? { ...f, [field]: val } : f)));
  }
  function remove(i: number) {
    onChange(faqs.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-navy">Service FAQs</p>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-line bg-bg-soft p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-blue">Q{i + 1}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <input
              value={faq.q}
              onChange={(e) => update(i, "q", e.target.value)}
              placeholder="Question"
              className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm font-semibold outline-none focus:border-blue"
            />
            <textarea
              value={faq.a}
              onChange={(e) => update(i, "a", e.target.value)}
              placeholder="Answer"
              rows={2}
              className="w-full resize-y rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...faqs, { q: "", a: "" }])}
          className="text-xs font-semibold text-blue hover:underline"
        >
          + Add FAQ
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Service Editor (one card per service)
// ──────────────────────────────────────────────────────────────────────────────
function ServiceEditor({ slug, dbRow }: { slug: string; dbRow: ServiceRow | null }) {
  const staticSvc = STATIC_SERVICES.find((s) => s.slug === slug);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [form, setForm] = useState<ServiceRow>(() =>
    dbRow ??
    ({
      slug,
      title: staticSvc?.title ?? "",
      shortTitle: staticSvc?.shortTitle ?? "",
      summary: staticSvc?.summary ?? "",
      description: staticSvc?.description ?? "",
      benefits: staticSvc?.benefits ?? [],
      steps: staticSvc?.steps ?? [],
      faqs: staticSvc?.faqs ?? [],
      startingFrom: staticSvc?.startingFrom ?? "",
      keywords: staticSvc?.keywords ?? [],
    } as ServiceRow)
  );

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/content/services/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      setMsg({ ok: true, text: "Saved successfully!" });
    } catch {
      setMsg({ ok: false, text: "Save failed. Try again." });
    } finally {
      setSaving(false);
    }
  }

  const field = (key: keyof ServiceRow) =>
    (val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="rounded-2xl border border-line bg-white shadow-[var(--shadow-sm)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div>
          <span className="font-bold text-navy">{form.title || slug}</span>
          {form.startingFrom && (
            <span className="ml-3 rounded-full bg-bg-soft px-2 py-0.5 text-xs text-muted">
              from {form.startingFrom}
            </span>
          )}
          {dbRow && (
            <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
              ✓ custom content
            </span>
          )}
        </div>
        <span className="text-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-line px-5 pb-6 pt-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-xs font-semibold text-muted uppercase tracking-wide">
              Page title
              <input
                value={form.title}
                onChange={(e) => field("title")(e.target.value)}
                className="rounded-lg border border-line px-3 py-2 text-sm text-navy outline-none focus:border-blue font-normal"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-muted uppercase tracking-wide">
              Short title (nav / cards)
              <input
                value={form.shortTitle}
                onChange={(e) => field("shortTitle")(e.target.value)}
                className="rounded-lg border border-line px-3 py-2 text-sm text-navy outline-none focus:border-blue font-normal"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-muted uppercase tracking-wide">
              Starting price
              <input
                value={form.startingFrom}
                onChange={(e) => field("startingFrom")(e.target.value)}
                className="rounded-lg border border-line px-3 py-2 text-sm text-navy outline-none focus:border-blue font-normal"
                placeholder="₹25,000"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="grid gap-1 text-xs font-semibold text-muted uppercase tracking-wide">
              One-line summary (appears in cards and meta description)
              <textarea
                value={form.summary}
                onChange={(e) => field("summary")(e.target.value)}
                rows={2}
                className="resize-y rounded-lg border border-line px-3 py-2 text-sm text-navy outline-none focus:border-blue font-normal"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="grid gap-1 text-xs font-semibold text-muted uppercase tracking-wide">
              Full page description (supports **bold** markdown, blank lines = paragraphs)
              <textarea
                value={form.description}
                onChange={(e) => field("description")(e.target.value)}
                rows={18}
                className="resize-y rounded-lg border border-line px-3 py-2 text-sm text-navy outline-none focus:border-blue font-normal font-mono leading-relaxed"
                placeholder="Write the full treatment description here — explain the procedure, who it's for, what to expect, cost overview..."
              />
            </label>
            <p className="mt-1 text-xs text-muted">
              Word count: {form.description.split(/\s+/).filter(Boolean).length}
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <StringListEditor
              label="Benefits (bullet points)"
              items={form.benefits}
              onChange={(v) => setForm((f) => ({ ...f, benefits: v }))}
              placeholder="e.g. Preserves jawbone structure"
            />
            <StringListEditor
              label="SEO Keywords (comma-separated usage, one per row)"
              items={form.keywords}
              onChange={(v) => setForm((f) => ({ ...f, keywords: v }))}
              placeholder="e.g. dental implants Bengaluru"
            />
          </div>

          <div className="mt-6">
            <StepsEditor
              steps={form.steps}
              onChange={(v) => setForm((f) => ({ ...f, steps: v }))}
            />
          </div>

          <div className="mt-6">
            <FaqPairsEditor
              faqs={form.faqs}
              onChange={(v) => setForm((f) => ({ ...f, faqs: v }))}
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-full bg-blue px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-deep disabled:opacity-50"
            >
              {saving ? "Saving…" : "💾 Save changes"}
            </button>
            {msg && (
              <span className={`text-sm font-medium ${msg.ok ? "text-success" : "text-red-600"}`}>
                {msg.text}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// FAQ Manager tab
// ──────────────────────────────────────────────────────────────────────────────
function FaqManager() {
  const [faqs, setFaqs] = useState<SiteFaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/content/faqs");
    const data = await res.json();
    setFaqs(data.faqs ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function seed() {
    setSeeding(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/content/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed", items: DEFAULT_FAQS.map(f => ({ question: f.question, answer: f.answer })) }),
      });
      if (!res.ok) throw new Error();
      setMsg("Default FAQs loaded!");
      await load();
    } catch {
      setMsg("Seed failed.");
    } finally {
      setSeeding(false);
    }
  }

  async function addFaq() {
    if (!newQ.trim() || !newA.trim()) return;
    const res = await fetch("/api/admin/content/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQ.trim(), answer: newA.trim(), sortOrder: faqs.length }),
    });
    if (res.ok) { setNewQ(""); setNewA(""); await load(); }
  }

  async function deleteFaq(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/content/faqs/${id}`, { method: "DELETE" });
    await load();
  }

  async function saveEdit() {
    if (!editId) return;
    await fetch(`/api/admin/content/faqs/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: editQ, answer: editA }),
    });
    setEditId(null);
    await load();
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/content/faqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    await load();
  }

  if (loading) return <p className="text-sm text-muted">Loading FAQs…</p>;

  return (
    <div>
      {/* Seed button */}
      {faqs.length === 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-800">No FAQs yet. Load the 10 professionally written defaults to get started.</p>
          <button
            onClick={seed}
            disabled={seeding}
            className="mt-3 rounded-full bg-amber-600 px-5 py-2 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {seeding ? "Loading…" : "🌱 Load Default FAQs (10)"}
          </button>
        </div>
      )}
      {faqs.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">{faqs.filter(f => f.isActive).length} active FAQs</p>
          <button
            onClick={seed}
            disabled={seeding}
            className="text-xs font-semibold text-muted hover:text-red-600 underline"
          >
            {seeding ? "Loading…" : "↺ Replace with defaults"}
          </button>
        </div>
      )}
      {msg && <p className="mb-3 text-sm font-medium text-success">{msg}</p>}

      {/* FAQ list */}
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className={`rounded-2xl border p-4 ${faq.isActive ? "border-line bg-white" : "border-line/50 bg-bg-soft opacity-60"}`}
          >
            {editId === faq.id ? (
              <>
                <input
                  value={editQ}
                  onChange={(e) => setEditQ(e.target.value)}
                  className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm font-semibold outline-none focus:border-blue"
                />
                <textarea
                  value={editA}
                  onChange={(e) => setEditA(e.target.value)}
                  rows={3}
                  className="w-full resize-y rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue"
                />
                <div className="mt-2 flex gap-2">
                  <button onClick={saveEdit} className="rounded-full bg-blue px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-deep">
                    Save
                  </button>
                  <button onClick={() => setEditId(null)} className="text-xs text-muted hover:text-navy">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold text-navy text-sm">{faq.question}</p>
                <p className="mt-1 text-sm text-muted leading-relaxed">{faq.answer}</p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => { setEditId(faq.id); setEditQ(faq.question); setEditA(faq.answer); }}
                    className="text-xs font-semibold text-blue hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(faq.id, faq.isActive)}
                    className="text-xs font-semibold text-muted hover:text-navy"
                  >
                    {faq.isActive ? "Hide on site" : "Show on site"}
                  </button>
                  <button
                    onClick={() => deleteFaq(faq.id)}
                    className="text-xs font-semibold text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new FAQ */}
      <div className="mt-6 rounded-2xl border border-line bg-bg-soft p-5">
        <p className="mb-3 text-sm font-bold text-navy">Add new FAQ</p>
        <input
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
          placeholder="Question"
          className="mb-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-blue"
        />
        <textarea
          value={newA}
          onChange={(e) => setNewA(e.target.value)}
          placeholder="Answer"
          rows={3}
          className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-blue"
        />
        <button
          onClick={addFaq}
          disabled={!newQ.trim() || !newA.trim()}
          className="mt-3 rounded-full bg-navy px-5 py-2 text-sm font-bold text-white hover:bg-navy-soft disabled:opacity-40"
        >
          + Add FAQ
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────────────────────
// Settings Manager tab — editable site stats
// ──────────────────────────────────────────────────────────────────────────────
function SettingsManager() {
  const [reviewCount, setReviewCount] = useState("");
  const [rating, setRating] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [patients, setPatients] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings ?? {};
        setReviewCount(s.review_count ?? "");
        setRating(s.review_rating ?? "");
        setYearsExp(s.years_experience ?? "");
        setPatients(s.patients_served ?? "");
      });
  }, []);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const body: Record<string, string> = {};
      if (reviewCount) body.review_count = reviewCount;
      if (rating) body.review_rating = rating;
      if (yearsExp) body.years_experience = yearsExp;
      if (patients) body.patients_served = patients;

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setMsg({ ok: true, text: "Saved! Site updates within 60 seconds." });
    } catch {
      setMsg({ ok: false, text: "Save failed. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    hint: string,
    type = "text"
  ) => (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-navy">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-line px-4 py-3 text-base outline-none focus:border-blue"
      />
      <span className="text-xs text-muted">{hint}</span>
    </label>
  );

  return (
    <div className="max-w-lg">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-sm)]">
        <h2 className="mb-1 text-lg font-bold text-navy">Clinic Stats</h2>
        <p className="mb-6 text-sm text-muted">
          These numbers appear on the homepage — doctor card, trust badges, and Google
          structured data. Update whenever you hit a milestone.
        </p>

        <div className="grid gap-5">
          {field(
            "Google Review Count",
            reviewCount,
            setReviewCount,
            'Shown as "58+ Google reviews" in the doctor card. Check Google Business Profile for the latest.',
            "number"
          )}
          {field(
            "Average Rating (e.g. 4.9)",
            rating,
            setRating,
            "Star rating shown next to the review count.",
          )}
          {field(
            "Years of Experience",
            yearsExp,
            setYearsExp,
            'Shown as "12+ Years Experience" trust badge.',
            "number"
          )}
          {field(
            "Patients Served (e.g. 1200+)",
            patients,
            setPatients,
            'Shown as "1200+ Happy Patients" trust badge.'
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-blue px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-deep disabled:opacity-50"
          >
            {saving ? "Saving…" : "💾 Save changes"}
          </button>
          {msg && (
            <span className={`text-sm font-medium ${msg.ok ? "text-success" : "text-red-600"}`}>
              {msg.text}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-blue/20 bg-blue/5 p-4">
        <p className="text-xs font-semibold text-blue-deep">💡 Tip</p>
        <p className="mt-1 text-xs text-muted leading-relaxed">
          Check your Google Business Profile every few weeks for the latest review count.
          Keeping this updated adds social proof and improves your Google ranking signals.
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main ContentManager
// ──────────────────────────────────────────────────────────────────────────────
export function ContentManager() {
  const [tab, setTab] = useState<"services" | "faqs" | "settings">("services");
  const [dbServices, setDbServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/services")
      .then((r) => r.json())
      .then((d) => {
        setDbServices((d.services ?? []).map(rowToService));
        setLoading(false);
      });
  }, []);

  async function seedAllServices() {
    setSeeding(true);
    setSeedMsg(null);
    try {
      const res = await fetch("/api/admin/content/services", { method: "POST" });
      if (!res.ok) throw new Error();
      const freshRes = await fetch("/api/admin/content/services");
      const data = await freshRes.json();
      setDbServices((data.services ?? []).map(rowToService));
      setSeedMsg("All 5 service pages loaded with professional content!");
    } catch {
      setSeedMsg("Seed failed. Reload and try again.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Content Manager</h1>
          <p className="mt-1 text-sm text-muted">
            Edit service page descriptions and site FAQs without touching code.
            Changes appear on the live site immediately.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-line bg-bg-soft p-1 w-fit">
        {(["services", "faqs", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              tab === t ? "bg-white text-navy shadow-sm" : "text-muted hover:text-navy"
            }`}
          >
            {t === "services" ? "🦷 Service Pages" : t === "faqs" ? "❓ Global FAQs" : "⚙️ Stats"}
          </button>
        ))}
      </div>

      {/* Services tab */}
      {tab === "services" && (
        <>
          {dbServices.length === 0 && !loading && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-800">
                No custom content saved yet. Load professionally written content for all 5
                treatments — then customise as needed.
              </p>
              <button
                onClick={seedAllServices}
                disabled={seeding}
                className="mt-3 rounded-full bg-amber-600 px-5 py-2 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {seeding ? "Loading content…" : "🌱 Load Default Content (all 5 services)"}
              </button>
            </div>
          )}
          {dbServices.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-muted">
                {dbServices.length} / {STATIC_SERVICES.length} services have custom content
              </p>
              <button
                onClick={seedAllServices}
                disabled={seeding}
                className="text-xs font-semibold text-muted underline hover:text-navy"
              >
                {seeding ? "Loading…" : "↺ Reload defaults"}
              </button>
            </div>
          )}
          {seedMsg && (
            <p className="mb-4 text-sm font-medium text-success">{seedMsg}</p>
          )}
          {loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : (
            <div className="space-y-3">
              {STATIC_SERVICES.map((s) => (
                <ServiceEditor
                  key={s.slug}
                  slug={s.slug}
                  dbRow={dbServices.find((r) => r.slug === s.slug) ?? null}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* FAQs tab */}
      {tab === "faqs" && <FaqManager />}

      {/* Settings tab */}
      {tab === "settings" && <SettingsManager />}
    </div>
  );
}
