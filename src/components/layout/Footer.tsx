import Image from "next/image";
import Link from "next/link";
import { site, services } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] gap-10 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image
            src="/images/logo-akshatha.svg"
            alt={site.name}
            width={160}
            height={42}
            className="mb-4 brightness-0 invert"
          />
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Premium prosthodontic care in {site.area}, {site.city}. Dental implants,
            crowns, dentures & smile restoration by {site.doctor}.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Treatments</h4>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-white">
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li>{site.address}</li>
            <li>
              <a href={`tel:${site.phone}`} className="hover:text-white">
                {site.phoneDisplay}
              </a>
            </li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
