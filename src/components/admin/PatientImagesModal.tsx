"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Img = { id: string; label: string; imageData: string; createdAt: string };

export function PatientImagesModal({
  patientPhone, patientName, onClose,
}: { patientPhone: string; patientName: string; onClose: () => void }) {
  const [images, setImages]   = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [label, setLabel]     = useState("");
  const [error, setError]     = useState("");
  const [preview, setPreview] = useState<Img | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/patient-images?phone=${encodeURIComponent(patientPhone)}`);
    const d = await res.json();
    setImages(d.images ?? []);
    setLoading(false);
  }, [patientPhone]);

  useEffect(() => { load(); }, [load]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4_500_000) { setError("File too large (max 4 MB)"); return; }
    setUploading(true); setError("");
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const imageData = ev.target?.result as string;
        const res = await fetch("/api/admin/patient-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: patientPhone, label: label || file.name, imageData }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || "Upload failed");
        setLabel("");
        if (fileRef.current) fileRef.current.value = "";
        await load();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/patient-images/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (preview?.id === id) setPreview(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-6 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,0,0,.2)] my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-navy">🩻 X-rays & Images</h2>
            <p className="text-xs text-muted mt-0.5">{patientName} · {patientPhone}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy rounded-full p-1.5 hover:bg-bg-soft transition-colors">✕</button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Upload */}
          <div className="rounded-2xl border-2 border-dashed border-line bg-bg-soft/50 p-4">
            <p className="text-xs font-bold text-navy mb-3">Upload X-ray / Image</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Label: e.g. OPG, Periapical #15, CBCT"
                className="flex-1 rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue"
              />
              <label className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-bold cursor-pointer transition-colors ${
                uploading ? "bg-gray-200 text-gray-500 cursor-wait" : "bg-navy text-white hover:bg-navy-soft"
              }`}>
                {uploading ? "Uploading…" : "📁 Choose File"}
                <input ref={fileRef} type="file" accept="image/*,.dcm" className="hidden" onChange={upload} disabled={uploading} />
              </label>
            </div>
            <p className="text-[10px] text-muted mt-2">Accepts JPG, PNG, GIF, WebP · max 4 MB</p>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          </div>

          {/* Gallery */}
          {loading ? (
            <div className="grid grid-cols-3 gap-3 animate-pulse">
              {[1,2,3].map((i) => <div key={i} className="aspect-square rounded-xl bg-line" />)}
            </div>
          ) : images.length === 0 ? (
            <p className="text-sm text-muted italic text-center py-4">No images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-line bg-bg-soft">
                  <img
                    src={img.imageData}
                    alt={img.label}
                    className="w-full aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setPreview(img)}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-white font-medium truncate flex-1">{img.label || "Image"}</span>
                    <button
                      onClick={() => del(img.id)}
                      className="text-red-400 hover:text-red-200 text-xs ml-1 flex-shrink-0"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-line px-6 py-4 text-right">
          <button onClick={onClose} className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-muted hover:bg-bg-soft transition-colors">
            Close
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-semibold">{preview.label || "Image"}</span>
              <div className="flex gap-2">
                <a
                  href={preview.imageData}
                  download={`${preview.label || "xray"}.jpg`}
                  className="rounded-full bg-white/20 text-white px-3 py-1 text-xs font-semibold hover:bg-white/30"
                >
                  ⬇ Download
                </a>
                <button onClick={() => setPreview(null)} className="rounded-full bg-white/20 text-white px-3 py-1 text-xs font-semibold hover:bg-white/30">
                  ✕ Close
                </button>
              </div>
            </div>
            <img src={preview.imageData} alt={preview.label} className="w-full rounded-xl max-h-[75vh] object-contain" />
            <p className="text-white/50 text-[10px] mt-2">
              {new Date(preview.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
