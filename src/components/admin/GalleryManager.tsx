"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type GalleryCase = {
  id: string;
  title: string;
  treatment: string;
  beforeUrl: string;
  afterUrl: string;
  description: string;
  isPublic: boolean;
  sortOrder: number;
  createdAt: string;
};

export function GalleryManager() {
  const [cases, setCases] = useState<GalleryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    treatment: "",
    description: "",
    isPublic: true,
    beforeUrl: "",
    afterUrl: "",
  });

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    if (res.ok) setCases(await res.json());
    setLoading(false);
  }

  async function uploadImage(file: File, type: "before" | "after") {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "gallery");
    const res = await fetch("/api/admin/offers/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => ({ ...f, [type === "before" ? "beforeUrl" : "afterUrl"]: url }));
    }
    setUploading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.beforeUrl || !form.afterUrl) {
      alert("Please upload both before and after images.");
      return;
    }
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const item = await res.json();
      setCases((prev) => [item, ...prev]);
      setCreating(false);
      setForm({ title: "", treatment: "", description: "", isPublic: true, beforeUrl: "", afterUrl: "" });
    }
  }

  async function togglePublic(id: string, current: boolean) {
    const res = await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isPublic: !current }),
    });
    if (res.ok) {
      setCases((prev) => prev.map((c) => c.id === id ? { ...c, isPublic: !current } : c));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this gallery case?")) return;
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) setCases((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">📸 Before/After Gallery</h2>
          <p className="text-sm text-muted mt-1">Showcase treatment results. Published cases appear on the public gallery page.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="rounded-xl bg-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
        >
          + Add Case
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="text-lg font-bold text-navy mb-4">New Gallery Case</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Full Mouth Rehabilitation"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase mb-1">Treatment</label>
                <input
                  type="text"
                  placeholder="e.g. Implants + Crowns"
                  value={form.treatment}
                  onChange={(e) => setForm((f) => ({ ...f, treatment: e.target.value }))}
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">Description</label>
              <textarea
                placeholder="Brief description of the case..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full rounded-xl border border-line px-3 py-2.5 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue/30 resize-none"
              />
            </div>

            {/* Image uploads */}
            <div className="grid grid-cols-2 gap-4">
              {(["before", "after"] as const).map((type) => {
                const url = type === "before" ? form.beforeUrl : form.afterUrl;
                const ref = type === "before" ? beforeInputRef : afterInputRef;
                return (
                  <div key={type} className="rounded-xl border-2 border-dashed border-line bg-bg p-4 text-center">
                    <div className="text-xs font-bold text-muted uppercase mb-2">{type} image</div>
                    {url ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={url} alt={type} fill className="object-cover" sizes="300px" />
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, [type === "before" ? "beforeUrl" : "afterUrl"]: "" }))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                        >✕</button>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => ref.current?.click()}
                          disabled={uploading}
                          className="text-sm font-semibold text-blue hover:underline disabled:opacity-50"
                        >
                          {uploading ? "Uploading..." : "Click to upload"}
                        </button>
                        <input
                          ref={ref}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImage(file, type);
                          }}
                        />
                        <div className="text-xs text-muted mt-1">JPG, PNG · max 4MB</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm font-medium text-navy">Show on public website</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 rounded-xl bg-blue py-2.5 text-sm font-bold text-white hover:bg-blue-deep transition-colors disabled:opacity-50"
              >
                Add to Gallery
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

      {/* Cases grid */}
      {loading ? (
        <div className="py-12 text-center text-muted">Loading...</div>
      ) : cases.length === 0 ? (
        <div className="py-12 text-center text-muted">No gallery cases yet. Add your first before/after case above.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cases.map((c) => (
            <div key={c.id} className="rounded-2xl border border-line bg-surface overflow-hidden">
              {/* Before/After images */}
              <div className="grid grid-cols-2 gap-0">
                <div className="relative aspect-video bg-gray-100">
                  <Image src={c.beforeUrl} alt="Before" fill className="object-cover" sizes="300px" />
                  <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded">BEFORE</span>
                </div>
                <div className="relative aspect-video bg-gray-100">
                  <Image src={c.afterUrl} alt="After" fill className="object-cover" sizes="300px" />
                  <span className="absolute bottom-2 left-2 bg-navy/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">AFTER</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-navy">{c.title}</h3>
                    {c.treatment && <div className="text-xs text-muted mt-0.5">{c.treatment}</div>}
                    {c.description && <div className="text-xs text-muted mt-1">{c.description}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => togglePublic(c.id, c.isPublic)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${c.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {c.isPublic ? "Public" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >✕</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
