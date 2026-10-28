"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site, services } from "@/lib/site";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Doctor" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
          <Link href="/" className="text-sm font-semibold text-navy-soft transition hover:text-blue">Home</Link>
          <Link href="/about" className="text-sm font-semibold text-navy-soft transition hover:text-blue">About Doctor</Link>

          {/* Services dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-semibold text-navy-soft transition hover:text-blue"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <svg viewBox="0 0 16 16" className={`h-3 w-3 transition-transform ${servicesOpen ? "rotate-180" : ""}`} fill="currentColor" aria-hidden>
                <path d="M3 5l5 5 5-5H3z" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 w-72 rounded-2xl border border-line bg-white shadow-[var(--shadow)] p-2 z-50">
                <Link
                  href="/services"
                  onClick={() => setServicesOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-muted hover:bg-bg-soft transition-colors"
                >
                  All Treatments →
                </Link>
                <div className="my-1 border-t border-line" />
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    onClick={() => setServicesOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-navy hover:bg-bg-soft transition-colors"
                  >
                    {s.shortTitle}
                  </Link>
                ))}
                <div className="my-1 border-t border-line" />
                <Link
                  href="/dental-implant-cost-bangalore"
                  onClick={() => setServicesOpen(false)}
                  className="flex items-center justify-between gap-2 rounded-xl bg-blue/5 border border-blue/20 px-3 py-2.5 hover:bg-blue/10 transition-colors"
                >
                  <span className="text-sm font-semibold text-blue">💰 Dental Implant Cost</span>
                  <span className="text-[10px] font-bold text-blue/70 bg-blue/10 rounded-full px-2 py-0.5">from ₹25,000</span>
                </Link>
              </div>
            )}
          </div>

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
          <div className="mx-auto flex w-[min(1120px,100%)] flex-col gap-1">
            <Link href="/" className="rounded-xl px-3 py-2 font-semibold text-navy hover:bg-bg-soft" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/about" className="rounded-xl px-3 py-2 font-semibold text-navy hover:bg-bg-soft" onClick={() => setOpen(false)}>About Doctor</Link>

            {/* Services group */}
            <div className="rounded-xl border border-line overflow-hidden mt-1">
              <Link href="/services" className="block px-3 py-2 font-semibold text-navy bg-bg-soft text-sm" onClick={() => setOpen(false)}>
                Services — All Treatments
              </Link>
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="block px-5 py-2 text-sm text-navy hover:bg-bg-soft border-t border-line/50"
                  onClick={() => setOpen(false)}
                >
                  {s.shortTitle}
                </Link>
              ))}
              <Link
                href="/dental-implant-cost-bangalore"
                className="flex items-center justify-between px-5 py-2.5 text-sm font-semibold text-blue bg-blue/5 border-t border-blue/20"
                onClick={() => setOpen(false)}
              >
                💰 Dental Implant Cost
                <span className="text-[10px] font-bold bg-blue/10 rounded-full px-2 py-0.5">from ₹25,000</span>
              </Link>
            </div>

            <Link href="/blog" className="rounded-xl px-3 py-2 font-semibold text-navy hover:bg-bg-soft mt-1" onClick={() => setOpen(false)}>Blog</Link>
            <Link href="/gallery" className="rounded-xl px-3 py-2 font-semibold text-navy hover:bg-bg-soft" onClick={() => setOpen(false)}>Gallery</Link>
            <Link href="/contact" className="rounded-xl px-3 py-2 font-semibold text-navy hover:bg-bg-soft" onClick={() => setOpen(false)}>Contact</Link>
            <Link href="/patient" className="rounded-xl px-3 py-2 font-semibold text-muted hover:bg-bg-soft" onClick={() => setOpen(false)}>🦷 Patient Login</Link>
            <div className="mt-2">
              <Button href="/contact#book" onClick={() => setOpen(false)}>Book Appointment</Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
