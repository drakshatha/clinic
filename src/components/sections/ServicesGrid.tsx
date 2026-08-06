import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function ServicesGrid() {
  return (
    <Section id="services">
      <SectionHeading
        kicker="Specialized Care"
        title="Prosthodontic Treatments Built Around Your Smile"
        description="From single implants to full mouth rehabilitation — specialist planning with natural, lasting results."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.slug} delay={i * 60}>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-navy">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {service.summary}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 text-sm font-bold text-navy transition hover:text-blue"
                >
                  Learn more →
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="/services" variant="secondary">
          Explore all services
        </Button>
      </div>
    </Section>
  );
}
