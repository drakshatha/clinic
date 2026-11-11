import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const SERVICE_IMAGE: Record<string, { src: string; alt: string }> = {
  "full-mouth-rehabilitation": {
    src: "/images/services/full-mouth-rehabilitation.jpg",
    alt: "Dental exam — full mouth rehabilitation at Akshatha Dental Clinic",
  },
  "dental-implants": {
    src: "/images/services/dental-implants.jpg",
    alt: "Dental implant model — titanium implant with crown",
  },
  "crowns-bridges": {
    src: "/images/services/crowns-bridges.jpg",
    alt: "Natural-looking dental crowns and bridges",
  },
  "dentures": {
    src: "/images/services/dentures.jpg",
    alt: "Complete and partial dentures — comfortable, natural fit",
  },
  "cosmetic-smile-makeover": {
    src: "/images/services/cosmetic-smile-makeover.jpg",
    alt: "Beautiful smile after cosmetic smile makeover",
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
          const img = SERVICE_IMAGE[service.slug];
          const isFeatured = i === 0;

          return (
            <Reveal key={service.slug} delay={i * 60}>
              <div className={isFeatured ? "sm:col-span-2" : ""}>
                <article
                  className={`group flex h-full overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)] ${
                    isFeatured ? "flex-col sm:flex-row" : "flex-col"
                  }`}
                >
                  {/* Photo banner */}
                  <div
                    className={`relative overflow-hidden bg-slate-100 ${
                      isFeatured
                        ? "h-56 sm:h-auto sm:w-2/5 shrink-0"
                        : "h-44"
                    }`}
                  >
                    {img && (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes={isFeatured ? "(max-width: 640px) 100vw, 40vw" : "(max-width: 640px) 100vw, 50vw"}
                      />
                    )}
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
