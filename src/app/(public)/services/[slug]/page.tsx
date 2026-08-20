import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services, site } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";

export const revalidate = 60; // ISR: revalidate every 60 seconds

type Props = { params: Promise<{ slug: string }> };

// ─── SEO copy per service ────────────────────────────────────────────────────
const seoMeta: Record<string, { title: string; description: string }> = {
  "dental-implants": {
    title: `Dental Implants in Bengaluru | Specialist Implantologist — ${site.doctor}`,
    description: `Dental implants by MDS Prosthodontist Dr. Akshatha V in Mahalakshmi Layout, Bengaluru. Permanent tooth replacement with titanium implants and custom crowns. Expert implant planning for single teeth and full-arch cases.`,
  },
  "full-mouth-rehabilitation": {
    title: `Full Mouth Rehabilitation in Bengaluru | Complete Dental Restoration — ${site.shortName}`,
    description: `Full mouth rehabilitation specialist in Bengaluru. Dr. Akshatha V, MDS Prosthodontist, rebuilds severely worn, damaged, or missing teeth through coordinated implants, crowns, bridges, and dentures.`,
  },
  "crowns-bridges": {
    title: `Dental Crowns & Bridges in Bengaluru | Prosthodontic Specialist`,
    description: `Precision-crafted dental crowns and bridges by Dr. Akshatha V, MDS Prosthodontist in Mahalakshmi Layout, Bengaluru. Zirconia, porcelain and metal-ceramic options with natural shade matching.`,
  },
  "dentures": {
    title: `Dentures in Bengaluru | Complete & Partial Dentures Specialist`,
    description: `Complete and partial dentures by specialist prosthodontist Dr. Akshatha V in Bengaluru. Custom-fitted for comfort and natural appearance. Implant-supported denture options also available.`,
  },
  "cosmetic-smile-makeover": {
    title: `Smile Makeover in Bengaluru | Cosmetic Dental Specialist — ${site.doctor}`,
    description: `Cosmetic smile makeover in Bengaluru by Dr. Akshatha V, MDS Prosthodontist. Personalised plans combining veneers, crowns, whitening and restorative care for a confident, natural-looking smile.`,
  },
};

// ─── Related services per slug ────────────────────────────────────────────────
const relatedServices: Record<string, string[]> = {
  "dental-implants": ["full-mouth-rehabilitation", "crowns-bridges", "dentures"],
  "full-mouth-rehabilitation": ["dental-implants", "crowns-bridges", "dentures"],
  "crowns-bridges": ["dental-implants", "cosmetic-smile-makeover", "full-mouth-rehabilitation"],
  "dentures": ["dental-implants", "full-mouth-rehabilitation", "cosmetic-smile-makeover"],
  "cosmetic-smile-makeover": ["crowns-bridges", "dental-implants", "full-mouth-rehabilitation"],
};

// ─── Image alt text per slug ──────────────────────────────────────────────────
const serviceImageAlt: Record<string, string> = {
  "dental-implants": "Dental implant procedure — titanium implant placed in the jaw by specialist prosthodontist in Bengaluru",
  "full-mouth-rehabilitation": "Full mouth rehabilitation consultation — comprehensive dental restoration plan by specialist in Bengaluru",
  "crowns-bridges": "Dental crown preparation — precision ceramic crown fitted by prosthodontist in Bengaluru",
  "dentures": "Custom denture fitting consultation — complete and partial dentures specialist in Bengaluru",
  "cosmetic-smile-makeover": "Cosmetic smile makeover — confident smile transformation by specialist prosthodontist in Bengaluru",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseJson<T>(raw: unknown, fallback: T): T {
  if (Array.isArray(raw)) return raw as T;
  try { return JSON.parse(String(raw)); }
  catch { return fallback; }
}

async function getServiceData(slug: string) {
  const base = getService(slug);
  if (!base) return null;
  try {
    const db = await prisma.serviceContent.findUnique({ where: { slug } });
    if (!db) return base;
    return {
      ...base,
      title:        db.title        || base.title,
      shortTitle:   db.shortTitle   || base.shortTitle,
      summary:      db.summary      || base.summary,
      description:  db.description  || base.description,
      startingFrom: db.startingFrom || base.startingFrom,
      benefits: parseJson<string[]>(db.benefits, []).length
        ? parseJson<string[]>(db.benefits, []) : base.benefits,
      steps: parseJson<{ title: string; body: string }[]>(db.steps, []).length
        ? parseJson<{ title: string; body: string }[]>(db.steps, []) : base.steps,
      faqs: parseJson<{ q: string; a: string }[]>(db.faqs, []).length
        ? parseJson<{ q: string; a: string }[]>(db.faqs, []) : base.faqs,
      keywords: parseJson<string[]>(db.keywords, []).length
        ? parseJson<string[]>(db.keywords, []) : base.keywords,
    };
  } catch {
    return base;
  }
}

// ─── Simple markdown-ish renderer ─────────────────────────────────────────────
function RichDescription({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="prose-custom space-y-4 leading-relaxed text-muted">
      {paragraphs.map((para, i) => {
        const lines = para.split("\n");
        const isList = lines.every((l) => l.trimStart().startsWith("-") || l.trimStart().startsWith("*"));
        if (isList) {
          return (
            <ul key={i} className="ml-4 space-y-1 list-disc">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^[\s\-\*]+/, ""))}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(para)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold text-navy">{part.slice(2, -2)}</strong>
      : part
  );
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceData(slug);
  if (!service) return {};
  const meta = seoMeta[slug];
  return {
    title: meta?.title ?? `${service.title} in Bengaluru | ${site.doctor}`,
    description: meta?.description ?? service.summary,
    keywords: service.keywords,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: meta?.title ?? `${service.title} | ${site.name}`,
      description: meta?.description ?? service.summary,
      url: `/services/${slug}`,
      images: [
        {
          url: service.image,
          alt: serviceImageAlt[slug] ?? service.title,
        },
      ],
    },
  };
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceData(slug);
  if (!service) notFound();

  const related = (relatedServices[slug] ?? [])
    .map((s) => services.find((x) => x.slug === s))
    .filter(Boolean);

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${site.url}/services/${slug}` },
    ],
  };

  // Service schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.summary,
    url: `${site.url}/services/${slug}`,
    provider: { "@id": `${site.url}/#clinic` },
    procedureType: "https://schema.org/TherapeuticProcedure",
  };

  // FAQPage schema (only if FAQs exist)
  const faqSchema = service.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ── Hero with breadcrumb ── */}
      <section className="bg-bg-soft pt-28 pb-12">
        <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-blue">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/services" className="hover:text-blue">Services</Link></li>
              <li aria-hidden>/</li>
              <li className="text-navy font-semibold">{service.title}</li>
            </ol>
          </nav>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
            {service.shortTitle}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">{service.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{service.summary}</p>
          <div className="mt-6">
            <Button href="/contact#book">Book a Consultation</Button>
          </div>
        </div>
      </section>

      {/* ── Description + Image ── */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] shadow-[var(--shadow)]">
            <Image
              src={service.image}
              alt={serviceImageAlt[slug] ?? service.title}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">About this treatment</h2>
            <div className="mt-4">
              <RichDescription text={service.description} />
            </div>
            {service.startingFrom && (
              <p className="mt-6 text-sm font-semibold text-navy">
                Starting from{" "}
                <span className="text-blue text-lg">{service.startingFrom}</span>
              </p>
            )}
            <p className="mt-3 text-xs text-muted">
              Exact fees are provided at your consultation once we assess your specific case.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Benefits ── */}
      <Section alt>
        <h2 className="mb-8 text-center text-3xl font-bold">Benefits</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {service.benefits.map((b) => (
            <div
              key={b}
              className="rounded-2xl border border-line bg-white p-5 font-medium text-navy shadow-[var(--shadow-sm)]"
            >
              <span className="mr-2 text-success">✔</span>
              {b}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Steps ── */}
      <Section>
        <h2 className="mb-8 text-center text-3xl font-bold">Treatment Process</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {service.steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-3xl border border-line bg-white p-6 text-center shadow-[var(--shadow-sm)]"
            >
              <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full bg-blue font-bold text-white">
                {i + 1}
              </div>
              <h3 className="font-bold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Gallery ── */}
      <Section alt>
        <h2 className="mb-4 text-center text-3xl font-bold">Smile Gallery</h2>
        <p className="mb-8 text-center text-muted">
          Real patient transformations are shared during your personal consultation.
        </p>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { src: "/images/before-after/gallery-veneers.jpg", alt: "Smile restoration with veneers — before and after result" },
            { src: "/images/before-after/gallery-full-mouth.jpg", alt: "Full mouth rehabilitation — complete dental restoration result" },
            { src: "/images/before-after/gallery-smile-makeover-2.jpg", alt: "Cosmetic smile makeover — confident smile transformation result" },
          ].map((img) => (
            <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--shadow-sm)]">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width:640px) 100vw, 33vw" />
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-muted">
          ✦ Illustrative images. Actual patient outcomes vary — your case will be assessed individually.
        </p>
      </Section>

      {/* ── FAQ ── */}
      {service.faqs.length > 0 && (
        <Section>
          <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="mx-auto max-w-3xl">
            <Accordion items={service.faqs} />
          </div>
          <div className="mt-10 text-center">
            <Button href="/contact#book">Book {service.shortTitle} Consultation</Button>
          </div>
        </Section>
      )}

      {/* ── Related Treatments ── */}
      {related.length > 0 && (
        <Section alt>
          <h2 className="mb-6 text-center text-2xl font-bold">Related Treatments</h2>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
            {related.map((r) => r && (
              <Link
                key={r.slug}
                href={`/services/${r.slug}`}
                className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-sm)] hover:border-blue hover:shadow-[var(--shadow)] transition group text-center"
              >
                <h3 className="font-bold text-navy group-hover:text-blue text-sm">{r.title}</h3>
                <p className="mt-1 text-xs text-muted line-clamp-2">{r.summary}</p>
                <p className="mt-3 text-xs font-bold text-blue">Learn more →</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ── Doctor CTA ── */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue mb-3">Your Specialist</p>
          <h2 className="text-2xl font-bold">Planned &amp; Performed by {site.doctor}</h2>
          <p className="mt-3 text-muted">
            MDS Prosthodontist with {site.yearsExperience}+ years of specialist experience in Bengaluru.
            Every treatment plan is tailored to your specific case, goals, and budget.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/contact#book">Book a Consultation</Button>
            <Button href="/about" variant="secondary">About the Doctor</Button>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
