"use client";

import { useState, useEffect, useCallback } from "react";

type Offer = {
  id: string;
  badge: string;
  title: string;
  description: string;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
};

const BADGE_PRESETS = ["OFFER", "20% OFF", "FREE", "LIMITED", "NEW", "SPECIAL"];

export function OffersManager() {
  const [offers, setOffers]   = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [badge,       setBadge]       = useState("OFFER");
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [validUntil,  setValidUntil]  = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/offers");
    const data = await res.json();
    setOffers(data.offers || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badge, title, description, validUntil }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setTitle(""); setDescription(""); setValidUntil(""); setBadge("OFFER");
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally { setSaving(false); }
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    await load();
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete offer "${title}"?`)) return;
    await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    await load();
  }

  const today = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

  return (
    <div className="mx-auto w-[min(800px,100%)] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">Offers & Promotions</h1>
          <p className="text-xs text-muted mt-0.5">Active offers appear as a banner on the public website</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-soft transition-colors"
        >
          {showForm ? "✕ Cancel" : "+ New Offer"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Create form */}
      {showForm && (
        <form onSubmit={create} className="rounded-2xl border border-blue/30 bg-blue/5 p-5 space-y-4">
          <p className="text-sm font-bold text-navy">New Offer</p>

          {/* Badge */}
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-wide">Badge Label</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {BADGE_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setBadge(p)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    badge === p ? "bg-navy text-white" : "border border-line text-muted hover:border-blue"
                  }`}
                >
                  {p}
                </button>
              ))}
              <input
                value={badge}
                onChange={(e) => setBadge(e.target.value.toUpperCase())}
                maxLength={12}
                placeholder="Custom…"
                className="rounded-full border border-line px-3 py-1 text-xs font-bold text-navy outline-none focus:border-blue w-24"
              />
            </div>
          </div>

          {/* Title */}
          <label className="grid gap-1 text-xs font-bold text-navy">
            Offer Headline <span className="text-red-500">*</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Free Consultation This Week · Implants Starting ₹22,000"
              className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal text-navy outline-none focus:border-blue"
            />
          </label>

          {/* Description */}
          <label className="grid gap-1 text-xs font-bold text-navy">
            Details <span className="font-normal text-muted">(optional)</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Valid for new patients only. Call to book."
              className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal text-navy outline-none focus:border-blue"
            />
          </label>

          {/* Valid until */}
          <label className="grid gap-1 text-xs font-bold text-navy">
            Valid Until <span className="font-normal text-muted">(leave blank = no expiry)</span>
            <input
              type="date"
              value={validUntil}
              min={today}
              onChange={(e) => setValidUntil(e.target.value)}
              className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal text-navy outline-none focus:border-blue w-44"
            />
          </label>

          {/* Preview */}
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">Preview</p>
            <div className="flex items-center gap-3 rounded-xl bg-navy px-4 py-3 text-white">
              <span className="rounded-full bg-blue px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider">
                {badge || "OFFER"}
              </span>
              <span className="text-sm font-semibold">{title || "Your offer headline here"}</span>
              {description && <span className="text-xs text-white/70">· {description}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-deep disabled:opacity-60 transition-colors"
          >
            {saving ? "Publishing…" : "Publish Offer"}
          </button>
        </form>
      )}

      {/* Offers list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-2xl border border-line bg-white animate-pulse" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
          No offers yet. Create one to display a promotion banner on the website.
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((o) => {
            const expired = o.validUntil && o.validUntil < today;
            return (
              <div
                key={o.id}
                className={`rounded-2xl border bg-white p-4 flex items-start gap-4 ${
                  !o.isActive || expired ? "border-line opacity-60" : "border-green-200"
                }`}
              >
                {/* Toggle */}
                <button
                  onClick={() => toggle(o.id, o.isActive)}
                  title={o.isActive ? "Click to deactivate" : "Click to activate"}
                  className={`mt-0.5 flex-shrink-0 w-10 h-6 rounded-full transition-colors relative ${
                    o.isActive && !expired ? "bg-green-500" : "bg-line"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      o.isActive && !expired ? "left-5" : "left-1"
                    }`}
                  />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-navy px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white">
                      {o.badge}
                    </span>
                    <span className="text-sm font-bold text-navy">{o.title}</span>
                    {expired && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                        EXPIRED
                      </span>
                    )}
                    {o.isActive && !expired && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        LIVE
                      </span>
                    )}
                  </div>
                  {o.description && (
                    <p className="text-xs text-muted mt-0.5">{o.description}</p>
                  )}
                  {o.validUntil && (
                    <p className="text-[11px] text-muted mt-1">
                      Valid until: <span className="font-semibold">{o.validUntil}</span>
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => remove(o.id, o.title)}
                  className="flex-shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:border-red-200 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
