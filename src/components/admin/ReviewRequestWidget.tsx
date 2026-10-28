"use client";

import { useState } from "react";

const REVIEW_URL = "https://g.page/r/CcptNvhnF_qkEBE/review";

const TEMPLATES = [
  {
    label: "Standard (post-visit)",
    message: `Hi [Name] 😊 Thank you for visiting Akshatha Dental Clinic! We hope your treatment went smoothly. If you're happy with your experience, we'd really appreciate a quick Google review — it helps other patients find us. Takes less than a minute: ${REVIEW_URL} 🙏`,
  },
  {
    label: "Implant / Major treatment",
    message: `Hi [Name], Dr. Akshatha wanted to personally check in — we hope you're feeling great after your procedure! When you get a chance, your honest review on Google means a lot to us and helps patients looking for a trusted implant specialist in Bengaluru: ${REVIEW_URL} Thank you! 🌟`,
  },
  {
    label: "Follow-up (3 days later)",
    message: `Hi [Name] 😊 Hope you're recovering well! A small favour — if you're pleased with your care at Akshatha Dental Clinic, would you mind leaving us a Google review? It genuinely helps: ${REVIEW_URL} Thank you so much!`,
  },
];

function copyToClipboard(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
}

export function ReviewRequestWidget() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    copyToClipboard(TEMPLATES[selected].message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const waLink = `https://wa.me/?text=${encodeURIComponent(TEMPLATES[selected].message)}`;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">⭐</span>
        <div>
          <p className="text-xs font-bold text-navy">Review Request Templates</p>
          <p className="text-[11px] text-muted">Send via WhatsApp after each appointment — aim for 2–3 reviews/month</p>
        </div>
      </div>

      {/* Template picker */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border ${
              selected === i
                ? "bg-navy text-white border-navy"
                : "border-line text-muted hover:text-navy"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Message preview */}
      <div className="rounded-xl bg-[#e9fbe5] border border-green-200 p-4 relative">
        <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{TEMPLATES[selected].message}</p>
      </div>

      <p className="text-[11px] text-muted">💡 Replace <strong>[Name]</strong> with the patient's name before sending.</p>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleCopy}
          className="rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-navy hover:bg-bg-soft transition-colors"
        >
          {copied ? "✅ Copied!" : "📋 Copy message"}
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
        >
          📱 Open in WhatsApp
        </a>
        <a
          href={REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-muted hover:text-navy transition-colors"
        >
          Preview review link ↗
        </a>
      </div>

      {/* 18-day reminder */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[11px] text-amber-800">
        <strong>18-day rule:</strong> Google Maps ranking drops if no new review in 3 weeks. Keep a steady drip — even 1 review every 2 weeks is enough to stay active.
      </div>
    </div>
  );
}
