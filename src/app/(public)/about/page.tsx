export const revalidate = 86400;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: `Dr. Akshatha V — MDS Prosthodontist & Implantologist in Bengaluru`,
  description: `Meet Dr. Akshatha V, MDS Prosthodontist & Implantologist with ${site.yearsExperience}+ years of experience in Mahalakshmi Layout, Bengaluru. Specialising in dental implants, full mouth rehabilitation, crowns, dentures and cosmetic smile makeovers.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `Dr. Akshatha V | MDS Prosthodontist in Bengaluru`,
    description: `${site.yearsExperience}+ years of specialist prosthodontic experience. Dental implants, full mouth rehabilitation, crowns & smile makeovers in Mahalakshmi Layout, Bengaluru.`,
    url: "/about",
    type: "profile",
    images: [
      {
        url: "/images/doctor-portrait-clean.png",
        width: 700,
        height: 880,
        alt: "Dr. Akshatha V — MDS Prosthodontist and Implantologist in Bengaluru",
      },
    ],
  },
};

// Doctor / Person schema
const doctorSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  "@id": `${site.url}/about#doctor`,
  name: site.doctor,
  jobTitle: "MDS Prosthodontist & Implantologist",
  description: `MDS Prosthodontist and Implantologist with ${site.yearsExperience}+ years of clinical experience, specialising in dental implants, full mouth rehabilitation, crowns, bridges, dentures, and cosmetic smile makeovers.`,
  medicalSpecialty: "Prosthodontics",
  image: `${site.url}/images/doctor-portrait-clean.png`,
  url: `${site.url}/about`,
  worksFor: {
    "@id": `${site.url}/#clinic`,
    "@type": "MedicalBusiness",
    name: site.name,
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "MDS — Prosthodontics & Implantology",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mahalakshmi Layout",
    addressRegion: "Karnataka",
    postalCode: "560096",
    addressCountry: "IN",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "About Doctor", item: `${site.url}/about` },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-bg-soft pt-28 pb-12">
        <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-blue">Home</Link></li>
              <li aria-hidden>/</li>
              <li className="text-navy font-semibold">About Doctor</li>
            </ol>
          </nav>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Meet Your Specialist</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">{site.doctor}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted">MDS Prosthodontist &amp; Implantologist · Mahalakshmi Layout, Bengaluru</p>
          </div>
        </div>
      </section>

      {/* Main bio */}
      <Section>
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-[28px] shadow-[var(--shadow)] md:sticky md:top-24">
            <Image
              src="/images/doctor-portrait-clean.png"
              alt="Dr. Akshatha V, MDS Prosthodontist and Implantologist at Akshatha Dental Clinic, Mahalakshmi Layout, Bengaluru"
              width={700}
              height={880}
              className="w-full object-cover"
              priority
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">A Specialist in Restoring Smiles</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Dr. Akshatha V is an MDS-qualified Prosthodontist and Implantologist with over {site.yearsExperience} years of clinical experience.
              Prosthodontics is the dental specialty focused on restoring and replacing teeth — and it requires a higher level of specialist training beyond a general dental degree.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              At Akshatha Dental Clinic in Mahalakshmi Layout, Bengaluru, she treats patients who need more than routine dentistry — people with multiple missing teeth, severely worn-down dentitions, failing restorations, or those seeking a comprehensive smile transformation.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Every treatment plan is built around the patient&apos;s specific goals, bone and tissue conditions, timeline, and budget. She believes in clear, unhurried consultations so patients fully understand their options before committing to any procedure.
            </p>

            {/* Credentials */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-navy mb-4">Qualifications & Expertise</h3>
              <ul className="space-y-3">
                {[
                  { label: "Degree", value: "MDS — Prosthodontics & Implantology" },
                  { label: "Experience", value: `${site.yearsExperience}+ years of clinical practice` },
                  { label: "Specialty", value: "Dental Implants, Full Mouth Rehabilitation" },
                  { label: "Also treats", value: "Crowns, Bridges, Dentures, Smile Makeovers" },
                  { label: "Patient focus", value: "Family & geriatric prosthodontics" },
                  { label: "Clinic", value: `${site.name}, ${site.area}, Bengaluru` },
                ].map((item) => (
                  <li key={item.label} className="flex gap-3 border-b border-line pb-3 text-sm">
                    <span className="w-28 flex-shrink-0 font-semibold text-navy">{item.label}</span>
                    <span className="text-muted">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact#book">Book a Consultation</Button>
              <Button href="/services" variant="secondary">View Treatments</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* What is a prosthodontist — E-E-A-T section */}
      <Section alt>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">What is a Prosthodontist?</h2>
          <p className="mt-4 leading-relaxed text-muted">
            A prosthodontist is a dental specialist who completes an additional 3-year postgraduate MDS programme in Prosthodontics after their BDS (dental degree). This specialist training focuses on the diagnosis, treatment planning, rehabilitation, and maintenance of patients with clinical conditions associated with missing or deficient teeth and oral and maxillofacial tissues.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            In practical terms, prosthodontists manage complex cases involving dental implants, full mouth rehabilitation, advanced crowns and bridges, partial and complete dentures, and cosmetic smile design — often coordinating with other dental specialists when needed.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-navy">When Should You See a Prosthodontist?</h2>
          <ul className="mt-4 space-y-2 text-muted leading-relaxed">
            {[
              "You have one or more missing teeth and are considering implants or dentures",
              "Your teeth are severely worn down from grinding or acid erosion",
              "You need multiple crowns, bridges, or restorations and want a coordinated plan",
              "You are considering a full smile makeover with veneers and cosmetic work",
              "You have had failing dental work and need a comprehensive rehabilitation plan",
              "You are a senior patient needing specialist denture or implant care",
              "Your general dentist has referred you for complex restorative treatment",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 text-success flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Treatment areas */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-navy mb-6">Treatments at Akshatha Dental Clinic</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Dental Implants", href: "/services/dental-implants", desc: "Permanent tooth replacement with titanium implants and custom crowns." },
              { title: "Full Mouth Rehabilitation", href: "/services/full-mouth-rehabilitation", desc: "Comprehensive restoration of bite, function, and smile aesthetics." },
              { title: "Crowns & Bridges", href: "/services/crowns-bridges", desc: "Precision restorations to protect damaged teeth and replace missing ones." },
              { title: "Dentures", href: "/services/dentures", desc: "Complete and partial dentures, including implant-supported options." },
              { title: "Cosmetic Smile Makeover", href: "/services/cosmetic-smile-makeover", desc: "Personalised combination of cosmetic treatments for a confident smile." },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-sm)] hover:border-blue hover:shadow-[var(--shadow)] transition group"
              >
                <h3 className="font-bold text-navy group-hover:text-blue">{t.title}</h3>
                <p className="mt-1 text-sm text-muted">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
