import Image from "next/image";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eef4fa_0%,#f9fbfe_55%,#ffffff_100%)] pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,153,194,0.18),transparent_50%)]" />
      <div className="relative mx-auto grid w-[min(1120px,calc(100%-2rem))] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
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
            <Button href="/services" variant="secondary">
              View Treatments
            </Button>
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

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-line bg-white/80 p-3 pr-5 shadow-[var(--shadow-sm)] backdrop-blur">
            <Image
              src="/images/doctor-portrait-clean.png"
              alt={site.doctor}
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-xl object-cover"
            />
            <div>
              <p className="font-bold text-navy">{site.doctor}</p>
              <p className="text-sm text-muted">{site.credentials}</p>
              <p className="mt-1 text-xs font-semibold text-blue">
                {site.rating}★ · {site.reviewCount}+ Google reviews
              </p>
            </div>
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="relative overflow-hidden rounded-[28px] shadow-[var(--shadow)]">
            <Image
              src="/images/family-smile-consultation.jpg"
              alt="Patient smile restoration consultation"
              width={900}
              height={1100}
              priority
              className="h-full max-h-[560px] w-full object-cover"
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
