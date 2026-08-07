"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

type Offer = {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string | null;
  validUntil: string | null;
};

const SESSION_KEY = "offers_popup_seen";

export function OffersPopup() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    fetch("/api/public/offers")
      .then((r) => r.json())
      .then((d: { offers: Offer[] }) => {
        // Show only image-based offers in popup; text-only go to ticker
        const imageOffer = (d.offers || []).find((o) => o.imageUrl);
        if (!imageOffer) return;
        setOffer(imageOffer);
        // Small delay so page loads first
        setTimeout(() => setVisible(true), 1200);
      })
      .catch(() => {});
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, close]);

  if (!offer || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden bg-white shadow-2xl animate-fade-up"
        style={{ animationDuration: "280ms" }}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow text-navy text-lg font-bold hover:bg-white transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Image */}
        {offer.imageUrl && (
          <div className="relative w-full" style={{ paddingBottom: "52%" }}>
            <Image
              src={offer.imageUrl}
              alt={offer.title}
              fill
              className="object-cover"
              sizes="448px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6 pt-4">
          <span className="inline-block rounded-full bg-navy px-3 py-0.5 text-[11px] font-extrabold tracking-widest text-white">
            {offer.badge}
          </span>
          <h2 className="mt-2 text-xl font-bold text-navy leading-tight">{offer.title}</h2>
          {offer.description && (
            <p className="mt-1 text-sm text-muted leading-relaxed">{offer.description}</p>
          )}
          {offer.validUntil && (
            <p className="mt-1 text-xs text-muted/70">Valid until {offer.validUntil}</p>
          )}

          <div className="mt-5 flex gap-3">
            <Link
              href="/contact#book"
              onClick={close}
              className="flex-1 rounded-full bg-blue py-3 text-center text-sm font-bold text-white hover:bg-blue-deep transition-colors"
            >
              Book Appointment
            </Link>
            <button
              onClick={close}
              className="rounded-full border border-line px-4 py-3 text-sm font-semibold text-muted hover:border-blue hover:text-navy transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
