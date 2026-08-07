export const revalidate = 86400;

import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: `About ${site.doctor} | Best Prosthodontist in ${site.city}`,
  description: `Meet ${site.doctor}, MDS Prosthodontist & Implantologist in ${site.area}, ${site.city}. ${site.yearsExperience}+ years specializing in implants and smile restoration.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-bg-soft pt-28 pb-12">
        <div className="mx-auto w-[min(1120px,calc(100%-2rem))] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">About Doctor</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">{site.doctor}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{site.credentials}</p>
        </div>
      </section>

      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-[28px] shadow-[var(--shadow)]">
            <Image
              src="/images/doctor-portrait-clean.png"
              alt={site.doctor}
              width={700}
              height={880}
              className="w-full object-cover"
              priority
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Expert in Smile Restoration</h2>
            <p className="mt-4 leading-relaxed text-muted">
              As a Prosthodontist, {site.doctor} specializes in dental implants, crowns &amp;
              bridges, dentures, and full-mouth rehabilitation — rebuilding both function and
              confident, natural-looking smiles.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              She believes dentistry should feel calm, clear, and confidence-building — right
              from the first visit. Every treatment plan is tailored to the patient’s goals,
              timeline, and budget.
            </p>
            <ul className="mt-6 space-y-3 font-medium text-navy">
              {[
                "MDS — Prosthodontics & Implantology",
                `${site.yearsExperience}+ years of clinical experience`,
                "Dental implants & full-mouth rehab specialist",
                "Smile design & cosmetic dentistry",
                "Family & geriatric prosthodontics",
              ].map((item) => (
                <li key={item} className="flex gap-2 border-b border-line pb-3">
                  <span className="text-success">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/contact#book">Book Consultation</Button>
            </div>
          </div>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
