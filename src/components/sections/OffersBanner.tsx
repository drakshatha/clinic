"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Offer = {
  id: string;
  badge: string;
  title: string;
  description: string;
  validUntil: string | null;
};

export function OffersBanner() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    fetch("/api/public/offers")
      .then((r) => r.json())
      .then((d) => setOffers(d.offers || []))
      .catch(() => {});
  }, []);

  if (offers.length === 0) return null;

  // Duplicate items for seamless loop
  const items = [...offers, ...offers];

  return (
    <div className="bg-navy text-white overflow-hidden">
      <div className="flex items-center">
        {/* Static label */}
        <div className="flex-shrink-0 bg-blue px-4 py-2.5 text-[11px] font-extrabold tracking-widest uppercase z-10">
          🎁 Offers
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden">
          <div
            className="flex gap-0 whitespace-nowrap"
            style={{ animation: "ticker 30s linear infinite" }}
          >
            {items.map((o, i) => (
              <Link
                key={`${o.id}-${i}`}
                href="/contact#book"
                className="inline-flex items-center gap-3 px-8 py-2.5 hover:opacity-80 transition-opacity"
              >
                <span className="rounded-full bg-blue/40 border border-blue/60 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider">
                  {o.badge}
                </span>
                <span className="text-sm font-semibold">{o.title}</span>
                {o.description && (
                  <span className="text-xs text-white/60">· {o.description}</span>
                )}
                {o.validUntil && (
                  <span className="text-[10px] text-white/50">till {o.validUntil}</span>
                )}
                <span className="text-white/30 mx-4">◆</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flex > div { animation: none; }
        }
      `}</style>
    </div>
  );
}
