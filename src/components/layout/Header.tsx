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
            alt={site.name}
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

        <button
          type="button"
          className="inline-flex flex-col gap-1.5 rounded-lg p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-navy" />
          <span className="block h-0.5 w-6 bg-navy" />
          <span className="block h-0.5 w-6 bg-navy" />
        </button>
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
