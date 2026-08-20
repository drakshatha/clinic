// ISR: revalidate every 60s so FAQ / stat edits appear quickly
export const revalidate = 60;

import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { BeforeAfterGallery } from "@/components/sections/BeforeAfterGallery";
import { DoctorSection } from "@/components/sections/DoctorSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";
import { EmergencyStrip } from "@/components/sections/EmergencyStrip";
import { HomeBooking } from "@/components/sections/HomeBooking";
import { CtaBand } from "@/components/sections/CtaBand";
import { prisma } from "@/lib/prisma";
import { faqs as staticFaqs, site } from "@/lib/site";
import { getSiteStats } from "@/lib/site-settings";
import { getGoogleReviews } from "@/lib/google-reviews";

export const metadata: Metadata = {
  title: `Prosthodontist in Bengaluru | Dental Implants & Full Mouth Rehabilitation | ${site.doctor}`,
  description: `${site.doctor}, MDS Prosthodontist in ${site.area}, ${site.city}. Specialist in dental implants, full mouth rehabilitation, crowns, dentures & cosmetic smile makeovers. Open daily 11 AM – 9:30 PM. Book a consultation.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `Prosthodontist in Bengaluru | ${site.doctor} — ${site.name}`,
    description: `Dental implants, full mouth rehabilitation, crowns, dentures & smile makeovers by specialist MDS Prosthodontist in Mahalakshmi Layout, Bengaluru.`,
    url: "/",
    type: "website",
  },
};

async function getActiveFaqs(): Promise<{ q: string; a: string }[]> {
  try {
    const rows = await prisma.siteFaq.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.length > 0 ? rows.map((r) => ({ q: r.question, a: r.answer })) : staticFaqs;
  } catch {
    return staticFaqs;
  }
}

export default async function HomePage() {
  const [faqItems, googleReviews, stats] = await Promise.all([
    getActiveFaqs(),
    getGoogleReviews(),   // live from Google Places API (cached 6h)
    getSiteStats(),       // for years experience + patients served
  ]);

  // FAQPage schema for homepage FAQ section
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero
        reviewCount={googleReviews.reviewCount}
        rating={googleReviews.rating}
        yearsExperience={stats.yearsExperience}
        patientsServed={stats.patientsServed}
      />
      <EmergencyStrip />
      <ServicesGrid />
      <BeforeAfterGallery />
      <CtaBand />
      <DoctorSection />
      <Testimonials />
      <HomeBooking />
      <FaqSection items={faqItems} />
      <CtaBand />
    </>
  );
}
