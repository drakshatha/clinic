"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ConsentItem = { id: string; title: string; signatureData: string; signedAt: string | null; createdAt: string };

const TEMPLATES: { title: string; content: string }[] = [
  {
    title: "Tooth Extraction Consent",
    content: `I, the undersigned patient (or authorized guardian), consent to the extraction of the tooth/teeth as recommended by Dr. ${""} at Akshatha Dental Clinic.

I understand and acknowledge the following:
• The procedure involves the removal of one or more teeth under local anesthesia.
• Possible risks include pain, swelling, infection, dry socket, nerve injury, sinus involvement (for upper back teeth), and difficulty opening the mouth.
• Post-operative bleeding and mild discomfort are expected and usually resolve within a few days.
• I will follow post-operative instructions provided by the clinic.
• Alternatives to extraction (such as root canal treatment) have been discussed with me.

I confirm that I have disclosed all relevant medical history, medications, and allergies. I have been given the opportunity to ask questions, which were answered to my satisfaction.`,
  },
  {
    title: "Dental Implant Consent",
    content: `I, the undersigned, consent to the placement of dental implant(s) as planned by the treating dentist at Akshatha Dental Clinic.

I understand:
• Dental implant surgery is performed under local anesthesia and involves placing a titanium fixture into the jawbone.
• Success depends on bone quality, oral hygiene, and general health. Implants can fail in some cases.
• Risks include pain, swelling, infection, nerve or sinus involvement, implant failure, and prolonged healing.
• Full osseointegration (bone attachment) takes 3–6 months before final crown placement.
• Smoking, uncontrolled diabetes, and poor oral hygiene significantly reduce success rates.
• The total treatment involves multiple visits and the final outcome depends on patient compliance.

I have disclosed all medications (including blood thinners, bisphosphonates) and medical conditions.`,
  },
  {
    title: "Root Canal Treatment Consent",
    content: `I consent to root canal treatment (Endodontic therapy) on the tooth/teeth as recommended by Akshatha Dental Clinic.

I understand:
• Root canal treatment involves removing infected pulp tissue, cleaning and shaping the root canals, and sealing them.
• The procedure is performed under local anesthesia and may require multiple appointments.
• Risks include instrument fracture inside the canal, perforation, incomplete sealing, or re-infection.
• A crown is strongly recommended after root canal treatment to protect the tooth.
• Some teeth may not be saveable despite treatment and may require extraction.
• Post-operative sensitivity and discomfort are common for a few days.`,
  },
  {
    title: "Crown / Bridge Consent",
    content: `I consent to the preparation and placement of a dental crown/bridge as recommended.

I understand:
• The procedure requires reshaping of the existing tooth structure, which is irreversible.
• Temporary crown/bridge will be placed while the permanent one is fabricated (1–2 weeks).
• Risks include sensitivity, bite changes, crown fracture, or need for root canal treatment post-procedure.
• Adjacent teeth (for bridges) will also be prepared, which is permanent.
• Implant-supported alternatives have been discussed where applicable.
• Longevity depends on oral hygiene and bite forces.`,
  },
  {
    title: "Teeth Whitening Consent",
    content: `I consent to professional teeth whitening treatment at Akshatha Dental Clinic.

I understand:
• Whitening is effective on natural tooth enamel and does not change the color of crowns, veneers, or fillings.
• Temporary tooth sensitivity and gum irritation may occur during or after treatment.
• Results vary based on the original shade and type of staining.
• Multiple sessions may be required for optimal results.
• I will avoid staining foods and beverages (coffee, tea, red wine) for 48 hours post-treatment.
• Results are not permanent and may require periodic maintenance.`,
  },
];

// ── Signature Pad ─────────────────────────────────────────────────────────────
function SignaturePad({ onSave, onCancel }: { onSave: (data: string) => void; onCancel: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing   = useRef(false);

  function getPos(canvas: HTMLCanvasElement, e: React.MouseEvent | React.TouchEvent) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
    };
  }

  function start(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    drawing.current = true;
  }

  function move(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1a2357";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function end() { drawing.current = false; }

  function clear() {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  }

  function save() {
    const canvas = canvasRef.current!;
    onSave(canvas.toDataURL("image/png"));
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-navy">Draw signature below</p>
      <div className="rounded-xl border-2 border-dashed border-blue/40 bg-blue/5 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={560}
          height={140}
          style={{ touchAction: "none", cursor: "crosshair", width: "100%", height: 140 }}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={clear} type="button"
          className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-bg-soft">
          🗑 Clear
        </button>
        <button onClick={onCancel} type="button"
          className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-bg-soft">
          Cancel
        </button>
        <button onClick={save} type="button"
          className="rounded-full bg-green-600 text-white px-4 py-2 text-xs font-bold hover:bg-green-700 ml-auto">
          ✓ Confirm Signature
        </button>
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function ConsentFormModal({
  patientPhone, patientName, onClose,
}: { patientPhone: string; patientName: string; onClose: () => void }) {
  const [tab,      setTab]      = useState<"new" | "saved">("new");
  const [forms,    setForms]    = useState<ConsentItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [savedId,  setSavedId]  = useState<string | null>(null);
  const [signing,  setSigning]  = useState<string | null>(null); // form id being signed
  const [showPad,  setShowPad]  = useState(false);
  const [error,    setError]    = useState("");

  // New form state
  const [templateIdx, setTemplateIdx] = useState(0);
  const [customTitle, setCustomTitle] = useState("");
  const [content,     setContent]     = useState(TEMPLATES[0].content);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/consent-forms?phone=${encodeURIComponent(patientPhone)}`);
    const d = await res.json();
    setForms(d.forms ?? []);
    setLoading(false);
  }, [patientPhone]);

  useEffect(() => { load(); }, [load]);

  function pickTemplate(idx: number) {
    setTemplateIdx(idx);
    if (idx < TEMPLATES.length) {
      setContent(TEMPLATES[idx].content);
      setCustomTitle("");
    } else {
      setContent("");
      setCustomTitle("");
    }
  }

  async function createForm() {
    const title = templateIdx < TEMPLATES.length ? TEMPLATES[templateIdx].title : customTitle.trim();
    if (!title) { setError("Enter a title"); return; }
    if (!content.trim()) { setError("Enter consent content"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/consent-forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: patientPhone, title, content }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setSavedId(d.id);
      setSigning(d.id);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    finally { setSaving(false); }
  }

  async function signForm(id: string, signatureData: string) {
    await fetch(`/api/admin/consent-forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signatureData }),
    });
    setShowPad(false);
    setSigning(null);
    setForms((prev) => prev.map((f) => f.id === id ? { ...f, signatureData, signedAt: new Date().toISOString() } : f));
    setSavedId(null);
  }

  async function del(id: string) {
    if (!confirm("Delete this consent form?")) return;
    await fetch(`/api/admin/consent-forms/${id}`, { method: "DELETE" });
    setForms((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-6 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-[0_24px_64px_rgba(0,0,0,.2)] my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-navy">📋 Consent Forms</h2>
            <p className="text-xs text-muted mt-0.5">{patientName} · {patientPhone}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy rounded-full p-1.5 hover:bg-bg-soft transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-line px-6">
          {(["new", "saved"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-px ${
                tab === t ? "border-navy text-navy" : "border-transparent text-muted hover:text-navy"
              }`}>
              {t === "new" ? "✍️ New Consent Form" : `📋 Saved (${forms.length})`}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
          {tab === "saved" ? (
            loading ? <p className="text-xs text-muted py-3">Loading…</p> :
            forms.length === 0 ? <p className="text-xs text-muted italic py-3">No consent forms yet.</p> : (
              <div className="space-y-2">
                {forms.map((f) => (
                  <div key={f.id} className="rounded-xl border border-line bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-navy">{f.title}</p>
                          {f.signedAt
                            ? <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-bold">✓ Signed</span>
                            : <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] font-bold">⏳ Unsigned</span>
                          }
                        </div>
                        <p className="text-[10px] text-muted mt-0.5">
                          Created {new Date(f.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                        </p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                        {!f.signedAt && (
                          <button onClick={() => { setSigning(f.id); setShowPad(true); }}
                            className="rounded-full border border-green-200 bg-green-50 text-green-700 px-2.5 py-1 text-[11px] font-semibold hover:bg-green-700 hover:text-white transition-colors">
                            ✍️ Sign
                          </button>
                        )}
                        <a href={`/api/admin/consent-forms/${f.id}?format=pdf`} target="_blank" rel="noopener noreferrer"
                          className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-navy hover:border-blue hover:text-blue transition-colors">
                          🖨 Print
                        </a>
                        <button onClick={() => del(f.id)}
                          className="rounded-full border border-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition-colors">
                          ✕
                        </button>
                      </div>
                    </div>
                    {/* Inline sign pad */}
                    {showPad && signing === f.id && (
                      <div className="mt-3 border-t border-line pt-3">
                        <SignaturePad
                          onSave={(data) => signForm(f.id, data)}
                          onCancel={() => { setShowPad(false); setSigning(null); }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : savedId ? (
            /* Success + sign */
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="text-3xl">✅</div>
                <p className="font-bold text-navy">Consent form created!</p>
                <div className="flex gap-3">
                  <a href={`/api/admin/consent-forms/${savedId}?format=pdf`} target="_blank" rel="noopener noreferrer"
                    className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-navy hover:border-blue hover:text-blue transition-colors">
                    🖨 Print
                  </a>
                </div>
              </div>
              <div className="border-t border-line pt-4">
                {showPad ? (
                  <SignaturePad
                    onSave={(data) => signForm(savedId, data)}
                    onCancel={() => { setShowPad(false); setSavedId(null); }}
                  />
                ) : (
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setShowPad(true)}
                      className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-soft transition-colors">
                      ✍️ Get Patient Signature Now
                    </button>
                    <button onClick={() => { setSavedId(null); setTemplateIdx(0); setContent(TEMPLATES[0].content); }}
                      className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted hover:bg-bg-soft transition-colors">
                      Create Another
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* New form */
            <div className="space-y-4">
              {/* Template picker */}
              <div>
                <p className="text-xs font-bold text-navy mb-2">Template</p>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATES.map((t, i) => (
                    <button key={i} onClick={() => pickTemplate(i)} type="button"
                      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors border ${
                        templateIdx === i ? "bg-navy text-white border-navy" : "border-line text-muted hover:border-navy hover:text-navy"
                      }`}>
                      {t.title}
                    </button>
                  ))}
                  <button onClick={() => pickTemplate(TEMPLATES.length)} type="button"
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors border ${
                      templateIdx === TEMPLATES.length ? "bg-navy text-white border-navy" : "border-line text-muted hover:border-navy hover:text-navy"
                    }`}>
                    ✏️ Custom
                  </button>
                </div>
              </div>

              {/* Custom title */}
              {templateIdx === TEMPLATES.length && (
                <label className="grid gap-1 text-xs font-semibold text-navy">
                  Form Title
                  <input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Implant Procedure Consent"
                    className="rounded-xl border border-line px-3 py-2 text-sm font-normal outline-none focus:border-blue" />
                </label>
              )}

              {/* Content */}
              <label className="grid gap-1 text-xs font-semibold text-navy">
                Consent Text
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10}
                  className="rounded-xl border border-line px-3 py-2 text-sm font-normal outline-none focus:border-blue resize-none" />
              </label>

              {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <button onClick={createForm} disabled={saving}
                className="w-full rounded-full bg-navy py-2.5 text-sm font-bold text-white hover:bg-navy-soft disabled:opacity-60 transition-colors">
                {saving ? "Creating…" : "📋 Create Consent Form"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
