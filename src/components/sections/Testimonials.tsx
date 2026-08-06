import { testimonials } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  return (
    <Section alt id="testimonials">
      <SectionHeading
        kicker="Patient Stories"
        title="Trusted by Families Across Bengaluru"
        description="Real reviews from patients who chose specialist prosthodontic care."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 70}>
            <article className="h-full rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-sm)]">
              <div className="mb-3 text-amber-500 tracking-widest">
                {"★".repeat(t.rating)}
              </div>
              <blockquote className="text-[15px] leading-relaxed text-navy-soft italic">
                “{t.text}”
              </blockquote>
              <p className="mt-5 text-sm font-bold text-navy">{t.name}</p>
              <p className="text-xs text-muted">Google Review</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
