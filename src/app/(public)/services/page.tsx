export const revalidate = 86400;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: `Prosthodontic Treatments in Bengaluru | Implants, Crowns & Dentures`,
  description: `Specialist prosthodontic care by Dr. Akshatha V in Mahalakshmi Layout, Bengaluru. Dental implants, full mouth rehabilitation, crowns & bridges, dentures, and cosmetic smile makeovers.`,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Dental Treatments in Bengaluru | ${site.name}`,
    description: `Dental implants, full mouth rehabilitation, crowns, dentures & smile makeovers by MDS Prosthodontist Dr. Akshatha V in Bengaluru.`,
    url: "/services",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
  ],
};

// Service-specific alt text for images
const serviceAltText: Record<string, string> = {
  "full-mouth-rehabilitation": "Full mouth rehabilitation consultation with dental specialist in Bengaluru",
  "dental-implants": "Dental implant consultation — titanium implant and crown replacement in Bengaluru",
  "crowns-bridges": "Dental crown fitting procedure by prosthodontist specialist",
  "dentures": "Denture fitting consultation for complete and partial dentures in Bengaluru",
  "cosmetic-smile-makeover": "Cosmetic smile makeover — before and after dental transformation in Bengaluru",
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="bg-bg-soft pt-28 pb-12">
        <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-blue">Home</Link></li>
              <li aria-hidden>/</li>
              <li className="text-navy font-semibold">Services</li>
            </ol>
          </nav>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Specialist Care</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">Prosthodontic Treatments in Bengaluru</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              Advanced restorative and cosmetic dentistry by {site.doctor}, MDS Prosthodontist —
              focused on lasting function and natural aesthetics.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          kicker="Our Expertise"
          title="Choose Your Treatment Path"
          description="Every treatment is led by an MDS Prosthodontist with clear plans, honest timelines, and transparent next steps."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group grid overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)] sm:grid-cols-[200px_1fr]"
            >
              <div className="relative min-h-[180px]">
                <Image
                  src={s.image}
                  alt={serviceAltText[s.slug] ?? s.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-navy group-hover:text-blue">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
                <p className="mt-4 text-sm font-bold text-blue">Learn more →</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Why specialist matters */}
      <Section alt>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-navy">Why Choose a Specialist Prosthodontist?</h2>
          <p className="mt-4 text-muted leading-relaxed">
            A prosthodontist completes 3 additional years of specialist MDS training after their dental degree —
            specifically focused on restoring and replacing teeth. For complex cases involving implants, worn dentitions,
            or full mouth reconstruction, specialist planning makes a measurable difference in outcomes and longevity.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
            {[
              { title: "Complex case expertise", body: "From single implants to full-arch reconstructions, planned with precision." },
              { title: "Coordinated treatment", body: "Multiple restorations designed together for bite harmony and aesthetics." },
              { title: "Long-term planning", body: "Treatment phased realistically around your timeline and budget." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-sm)]">
                <h3 className="font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-sm font-bold text-blue hover:underline"
            >
              Meet Dr. Akshatha V →
            </Link>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
