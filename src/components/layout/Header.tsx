"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Doctor" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition ${
        scrolled
          ? "border-line bg-white/95 shadow-[var(--shadow-sm)] backdrop-blur"
          : "border-transparent bg-white/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-[72px] w-[min(1120px,calc(100%-2rem))] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo-akshatha.svg"
            alt={`${site.name} — Dental Clinic in Bengaluru`}
            width={168}
            height={44}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-navy-soft transition hover:text-blue"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/patient"
            className="text-sm font-semibold text-muted hover:text-blue transition"
          >
            Patient Login
          </Link>
          <Button href="/contact#book" className="!py-2.5 !px-5">
            Book Appointment
          </Button>
        </nav>

        {/* Mobile quick-actions: tap-to-call + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={`tel:${site.phone}`}
            aria-label={`Call ${site.phoneDisplay}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy shadow-sm hover:bg-bg-soft"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
              <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.5-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1l-2.3 2.3Z"/>
            </svg>
          </a>
          <button
            type="button"
            className="inline-flex flex-col gap-1.5 rounded-lg p-2"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-0.5 w-6 bg-navy" />
            <span className="block h-0.5 w-6 bg-navy" />
            <span className="block h-0.5 w-6 bg-navy" />
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex w-[min(1120px,100%)] flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 font-semibold text-navy hover:bg-bg-soft"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/patient"
              className="rounded-xl px-3 py-2 font-semibold text-muted hover:bg-bg-soft"
              onClick={() => setOpen(false)}
            >
              🦷 Patient Login
            </Link>
            <Button href="/contact#book" onClick={() => setOpen(false)}>
              Book Appointment
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
