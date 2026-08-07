"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicOffer } from "./OffersBanner";

const SESSION_KEY = "offers_popup_seen";

export function OffersPopup({ initialOffers = [] }: { initialOffers?: PublicOffer[] }) {
  const imageOffer = initialOffers.find((o) => o.imageUrl) ?? null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!imageOffer) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, [imageOffer]);

  const close = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, close]);

  if (!imageOffer || !visible) return null;

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
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow text-navy text-lg font-bold hover:bg-white transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {imageOffer.imageUrl && (
          <div className="relative w-full" style={{ paddingBottom: "52%" }}>
            <Image
              src={imageOffer.imageUrl}
              alt={imageOffer.title}
              fill
              className="object-cover"
              sizes="448px"
              priority
            />
          </div>
        )}

        <div className="px-6 pb-6 pt-4">
          <span className="inline-block rounded-full bg-navy px-3 py-0.5 text-[11px] font-extrabold tracking-widest text-white">
            {imageOffer.badge}
          </span>
          <h2 className="mt-2 text-xl font-bold text-navy leading-tight">{imageOffer.title}</h2>
          {imageOffer.description && (
            <p className="mt-1 text-sm text-muted leading-relaxed">{imageOffer.description}</p>
          )}
          {imageOffer.validUntil && (
            <p className="mt-1 text-xs text-muted/70">Valid until {imageOffer.validUntil}</p>
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
