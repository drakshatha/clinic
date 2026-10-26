import Link from "next/link";
import { services } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

// Unique gradient + icon per service — replaces repetitive stock photos
const SERVICE_VISUAL: Record<string, {
  gradient: string;
  icon: React.ReactNode;
}> = {
  "full-mouth-rehabilitation": {
    gradient: "from-[#1a3a6b] to-[#2563eb]",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        {/* Mouth / full smile */}
        <path d="M12 32 Q32 52 52 32" />
        <path d="M20 28 Q32 40 44 28" />
        <rect x="20" y="20" width="6" height="10" rx="2" fill="white" fillOpacity="0.25" stroke="white" />
        <rect x="29" y="18" width="6" height="12" rx="2" fill="white" fillOpacity="0.25" stroke="white" />
        <rect x="38" y="20" width="6" height="10" rx="2" fill="white" fillOpacity="0.25" stroke="white" />
      </svg>
    ),
  },
  "dental-implants": {
    gradient: "from-[#0f4c5c] to-[#0891b2]",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        {/* Tooth on implant screw */}
        <path d="M32 10 C24 10 20 16 20 22 C20 26 22 29 23 33 L24 42 L32 42 L40 42 L41 33 C42 29 44 26 44 22 C44 16 40 10 32 10Z" fill="white" fillOpacity="0.2" />
        <line x1="32" y1="42" x2="32" y2="56" />
        <line x1="28" y1="46" x2="36" y2="46" />
        <line x1="28" y1="50" x2="36" y2="50" />
        <line x1="28" y1="54" x2="36" y2="54" />
      </svg>
    ),
  },
  "crowns-bridges": {
    gradient: "from-[#7c3a06] to-[#d97706]",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        {/* Crown shape */}
        <path d="M14 44 L14 28 L22 36 L32 20 L42 36 L50 28 L50 44 Z" fill="white" fillOpacity="0.2" />
        <line x1="14" y1="48" x2="50" y2="48" strokeWidth="3" />
      </svg>
    ),
  },
  "dentures": {
    gradient: "from-[#064e3b] to-[#059669]",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        {/* Row of teeth on arch */}
        <path d="M12 34 Q32 50 52 34" />
        <rect x="14" y="22" width="6" height="13" rx="2" fill="white" fillOpacity="0.25" stroke="white" />
        <rect x="22" y="19" width="7" height="16" rx="2" fill="white" fillOpacity="0.25" stroke="white" />
        <rect x="31" y="19" width="7" height="16" rx="2" fill="white" fillOpacity="0.25" stroke="white" />
        <rect x="40" y="22" width="6" height="13" rx="2" fill="white" fillOpacity="0.25" stroke="white" />
      </svg>
    ),
  },
  "cosmetic-smile-makeover": {
    gradient: "from-[#5b21b6] to-[#7c3aed]",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        {/* Smile with sparkles */}
        <path d="M18 34 Q32 48 46 34" />
        <line x1="48" y1="16" x2="48" y2="24" /><line x1="44" y1="20" x2="52" y2="20" />
        <line x1="16" y1="14" x2="16" y2="20" /><line x1="13" y1="17" x2="19" y2="17" />
        <line x1="52" y1="36" x2="52" y2="40" /><line x1="50" y1="38" x2="54" y2="38" />
        <circle cx="32" cy="28" r="14" />
      </svg>
    ),
  },
};

export function ServicesGrid() {
  return (
    <Section id="services">
      <SectionHeading
        kicker="Specialized Care"
        title="Prosthodontic Treatments Built Around Your Smile"
        description="From single implants to full mouth rehabilitation — specialist planning with natural, lasting results."
      />

      {/* 5-card grid: first card featured (full-width on sm+), then 2×2 */}
      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((service, i) => {
          const visual = SERVICE_VISUAL[service.slug];
          const isFeatured = i === 0;

          return (
            <Reveal key={service.slug} delay={i * 60}>
              <div className={isFeatured ? "sm:col-span-2" : ""}>
                <article
                  className={`group flex h-full overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)] ${
                    isFeatured ? "flex-col sm:flex-row" : "flex-col"
                  }`}
                >
                  {/* Gradient banner */}
                  <div
                    className={`bg-gradient-to-br ${visual?.gradient ?? "from-blue-700 to-blue-900"} flex items-center justify-center overflow-hidden ${
                      isFeatured
                        ? "h-48 sm:h-auto sm:w-2/5 shrink-0"
                        : "h-40"
                    }`}
                  >
                    <div className="p-6">
                      {visual?.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex flex-1 flex-col p-6 ${isFeatured ? "sm:justify-center" : ""}`}>
                    <h3 className={`font-bold text-navy ${isFeatured ? "text-2xl" : "text-xl"}`}>
                      {service.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {service.summary}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-4 text-sm font-bold text-navy transition hover:text-blue"
                      aria-label={`Learn more about ${service.title}`}
                    >
                      Learn more →
                    </Link>
                  </div>
                </article>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Button href="/services" variant="secondary">
          Explore all treatments
        </Button>
      </div>
    </Section>
  );
}
