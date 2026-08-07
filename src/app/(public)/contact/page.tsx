export const revalidate = 3600;

import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: `Contact & Book Appointment | Prosthodontist in ${site.city}`,
  description: `Book a consultation with ${site.doctor} in ${site.area}, ${site.city}. Call ${site.phoneDisplay} or request an appointment online.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-bg-soft pt-28 pb-12">
        <div className="mx-auto w-[min(1120px,calc(100%-2rem))] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Contact</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Book Your Consultation</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Limited appointments available daily. We’ll confirm on WhatsApp.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Clinic Details</h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-navy-soft">
              <li>
                <strong className="text-navy">Address</strong>
                <br />
                {site.address}
              </li>
              <li>
                <strong className="text-navy">Phone</strong>
                <br />
                <a href={`tel:${site.phone}`} className="text-blue hover:underline">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <strong className="text-navy">Hours</strong>
                <br />
                {site.hours}
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`tel:${site.phone}`} variant="secondary">
                Call Now
              </Button>
              <Button
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  "Hi, I want to book a consultation."
                )}`}
              >
                WhatsApp
              </Button>
            </div>
            <div className="mt-8 overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-sm)]">
              <iframe
                title="Clinic location map"
                src={site.mapsEmbed}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div id="book">
            <AppointmentForm />
          </div>
        </div>
      </Section>
    </>
  );
}
