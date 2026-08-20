// Revalidate every 60s — picks up FAQ + stats edits from admin within a minute
export const revalidate = 60;

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
import { faqs as staticFaqs } from "@/lib/site";
import { getSiteStats } from "@/lib/site-settings";

async function getActiveFaqs(): Promise<{ q: string; a: string }[]> {
  try {
    const rows = await prisma.siteFaq.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) return staticFaqs;
    return rows.map((r) => ({ q: r.question, a: r.answer }));
  } catch {
    return staticFaqs;
  }
}

export default async function HomePage() {
  const [faqItems, stats] = await Promise.all([getActiveFaqs(), getSiteStats()]);

  return (
    <>
      <Hero {...stats} />
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
