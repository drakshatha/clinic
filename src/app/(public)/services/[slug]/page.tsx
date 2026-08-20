import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getService, services, site } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";

export const revalidate = 60; // ISR: revalidate every 60 seconds

type Props = { params: Promise<{ slug: string }> };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseJson<T>(raw: unknown, fallback: T): T {
  if (Array.isArray(raw)) return raw as T;
  try { return JSON.parse(String(raw)); }
  catch { return fallback; }
}

// Merge DB content on top of static defaults
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
        ? parseJson<string[]>(db.benefits, [])
        : base.benefits,
      steps: parseJson<{ title: string; body: string }[]>(db.steps, []).length
        ? parseJson<{ title: string; body: string }[]>(db.steps, [])
        : base.steps,
      faqs: parseJson<{ q: string; a: string }[]>(db.faqs, []).length
        ? parseJson<{ q: string; a: string }[]>(db.faqs, [])
        : base.faqs,
      keywords: parseJson<string[]>(db.keywords, []).length
        ? parseJson<string[]>(db.keywords, [])
        : base.keywords,
    };
  } catch {
    return base; // graceful fallback if DB is unreachable
  }
}

// ─── Simple markdown-ish renderer: **bold**, blank line → paragraph ────────
function RichDescription({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="prose-custom space-y-4 leading-relaxed text-muted">
      {paragraphs.map((para, i) => {
        // Lines starting with - or * are list items
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
  // Split on **bold** markers
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
  return {
    title: `${service.title} Specialist in ${site.city}`,
    description: service.summary,
    keywords: service.keywords,
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

  return (
    <>
      <section className="bg-bg-soft pt-28 pb-12">
        <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
            {service.shortTitle}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-5xl">{service.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{service.summary}</p>
          <div className="mt-6">
            <Button href="/contact#book">Book Now</Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] shadow-[var(--shadow)]">
            <Image
              src={service.image}
              alt={service.title}
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
          </div>
        </div>
      </Section>

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

      <Section>
        <h2 className="mb-8 text-center text-3xl font-bold">Procedure Steps</h2>
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

      <Section alt>
        <h2 className="mb-4 text-center text-3xl font-bold">Smile Gallery</h2>
        <p className="mb-8 text-center text-muted">
          Real patient cases and outcomes are shared during your personal consultation.
        </p>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { src: "/images/before-after/gallery-veneers.jpg", alt: "Dentist shade-matching veneers for a smiling patient" },
            { src: "/images/before-after/gallery-full-mouth.jpg", alt: "Senior patient delighted with her full mouth rehabilitation result" },
            { src: "/images/before-after/gallery-smile-makeover-2.jpg", alt: "Woman showing confident bright smile after treatment" },
          ].map((img) => (
            <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--shadow-sm)]">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width:640px) 100vw, 33vw" />
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-muted">
          ✦ Illustrative images. Real patient cases available to view at your consultation.
        </p>
      </Section>

      {service.faqs.length > 0 && (
        <Section>
          <h2 className="mb-8 text-center text-3xl font-bold">FAQ</h2>
          <div className="mx-auto max-w-3xl">
            <Accordion items={service.faqs} />
          </div>
          <div className="mt-10 text-center">
            <Button href="/contact#book">Book {service.shortTitle} Consultation</Button>
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
