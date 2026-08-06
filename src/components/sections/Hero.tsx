import Image from "next/image";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eef4fa_0%,#f9fbfe_55%,#ffffff_100%)] pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,153,194,0.18),transparent_50%)]" />
      <div className="relative mx-auto grid w-[min(1120px,calc(100%-2rem))] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">

        {/* ── Left: copy ── */}
        <div className="animate-fade-up">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-blue">
            MDS Prosthodontist · {site.city}
          </p>
          <h1 className="max-w-xl text-4xl font-bold leading-[1.1] text-navy md:text-5xl lg:text-[3.25rem]">
            Advanced Smile Restoration by Expert Prosthodontist
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            Dental implants, full mouth rehabilitation, crowns, dentures & cosmetic smile
            makeovers — precision care that restores function and confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact#book">Book Appointment</Button>
            <Button href="/services" variant="secondary">View Treatments</Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              `${site.yearsExperience}+ Years Experience`,
              `${site.patientsServed} Happy Patients`,
              "US-Grade Technology",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-navy shadow-[var(--shadow-sm)]"
              >
                <span className="mr-2 text-success">✔</span>
                {item}
              </div>
            ))}
          </div>

          {/* Doctor card + Google review */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-white/80 p-3 pr-5 shadow-[var(--shadow-sm)] backdrop-blur flex-1">
              <Image
                src="/images/doctor-portrait-clean.png"
                alt={site.doctor}
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-xl object-cover flex-shrink-0"
              />
              <div>
                <p className="font-bold text-navy">{site.doctor}</p>
                <p className="text-sm text-muted">{site.credentials}</p>
                <p className="mt-1 text-xs font-semibold text-blue">
                  {site.rating}★ · {site.reviewCount}+ Google reviews
                </p>
              </div>
            </div>

            {/* Google Review CTA */}
            <a
              href={site.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold text-navy shadow-[var(--shadow-sm)] hover:border-blue hover:text-blue transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              ⭐ Write a Review
            </a>
          </div>
        </div>

        {/* ── Right: image ── */}
        <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="relative overflow-hidden rounded-[28px] shadow-[var(--shadow)]" style={{ minHeight: "480px" }}>
            <Image
              src="/images/family-smile-consultation.jpg"
              alt="Patient smile restoration consultation"
              width={900}
              height={1100}
              priority
              className="w-full object-cover"
              style={{ height: "100%", minHeight: "480px", maxHeight: "680px" }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                Smile confidence restored
              </p>
              <p className="mt-1 text-lg font-bold">Specialist prosthodontic care</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
