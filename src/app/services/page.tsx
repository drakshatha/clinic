import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: `Dental Services | Implants, Crowns & Smile Makeovers in ${site.city}`,
  description:
    "Explore prosthodontic services: full mouth rehabilitation, dental implants, crowns & bridges, dentures, and cosmetic smile makeovers.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-bg-soft pt-28 pb-12">
        <div className="mx-auto w-[min(1120px,calc(100%-2rem))] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Services</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Specialist Prosthodontic Care</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Advanced restorative and cosmetic dentistry focused on lasting function and natural
            aesthetics.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeading
          kicker="Our Expertise"
          title="Choose Your Treatment Path"
          description="Every service is led by an MDS Prosthodontist with clear plans and transparent next steps."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group grid overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)] sm:grid-cols-[200px_1fr]"
            >
              <div className="relative min-h-[180px]">
                <Image src={s.image} alt={s.title} fill className="object-cover" sizes="200px" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-navy group-hover:text-blue">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
                <p className="mt-4 text-sm font-bold text-blue">Book a consultation →</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
