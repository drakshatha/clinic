import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { BeforeAfterGallery } from "@/components/sections/BeforeAfterGallery";
import { DoctorSection } from "@/components/sections/DoctorSection";
import { Testimonials } from "@/components/sections/Testimonials";

import { FaqSection } from "@/components/sections/FaqSection";
import { EmergencyStrip } from "@/components/sections/EmergencyStrip";
import { HomeBooking } from "@/components/sections/HomeBooking";
import { CtaBand } from "@/components/sections/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EmergencyStrip />
      <ServicesGrid />
      <BeforeAfterGallery />
      <CtaBand />
      <DoctorSection />
      <Testimonials />
      <HomeBooking />
      <FaqSection />
      <CtaBand />
    </>
  );
}
