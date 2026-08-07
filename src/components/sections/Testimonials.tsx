import { testimonials } from "@/lib/site";
import { site } from "@/lib/site";
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
                "{t.text}"
              </blockquote>
              <p className="mt-5 text-sm font-bold text-navy">{t.name}</p>
              <p className="text-xs text-muted">Google Review</p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Google Review CTA */}
      <Reveal delay={220}>
        <div className="mt-12 rounded-3xl border border-line bg-white p-8 text-center shadow-[var(--shadow-sm)]">
          <p className="text-xs font-bold uppercase tracking-widest text-blue mb-2">Share Your Experience</p>
          <h3 className="text-lg font-bold text-navy">Loved your visit? Tell other patients!</h3>
          <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
            Your honest review helps families in Bengaluru find trusted prosthodontic care.
          </p>

          <a
            href={site.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 rounded-full border-2 border-line bg-white px-7 py-3.5 text-sm font-bold text-navy shadow-[var(--shadow-sm)] hover:border-[#4285F4] hover:shadow-[var(--shadow)] transition-all"
          >
            {/* Google logo */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Write a Google Review
            <span className="text-muted">→</span>
          </a>

          <p className="mt-3 text-[11px] text-muted/70">
            Takes less than 60 seconds · Opens Google Reviews
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
