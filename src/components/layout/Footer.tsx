import Image from "next/image";
import Link from "next/link";
import { site, services } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] gap-10 py-16 md:grid-cols-[1.3fr_1fr_1fr]">

        {/* Brand */}
        <div>
          <Image
            src="/images/logo-akshatha.svg"
            alt={`${site.name} logo`}
            width={160}
            height={42}
            className="mb-4 brightness-0 invert"
          />
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Specialist prosthodontic care in {site.area}, {site.city}. Dental implants,
            crowns, dentures &amp; smile restoration by {site.doctor}, MDS Prosthodontist.
          </p>
          <p className="mt-4 text-xs text-white/40">
            Open daily 11 AM – 9:30 PM
          </p>
        </div>

        {/* Treatments */}
        <div>
          <h4 className="mb-4 font-semibold text-white">Treatments</h4>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="hover:text-white transition-colors"
                  aria-label={`Learn about ${s.title}`}
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <address className="not-italic text-white/70 text-xs leading-relaxed">
                {site.address}
              </address>
            </li>
            <li>
              <a href={`tel:${site.phone}`} className="hover:text-white transition-colors">
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white transition-colors text-xs">
                {site.email}
              </a>
            </li>
            <li className="pt-1">
              <a
                href={site.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:border-white/60 hover:text-white transition-colors"
                aria-label="Leave a Google review for Akshatha Dental Clinic"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Leave a Google Review
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-wrap items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <nav aria-label="Footer links">
            <ul className="flex gap-4">
              <li><Link href="/about" className="hover:text-white/70 transition-colors">About</Link></li>
              <li><Link href="/services" className="hover:text-white/70 transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-white/70 transition-colors">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
