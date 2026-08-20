export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { AppointmentForm } from "@/components/sections/AppointmentForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: `Book Appointment | Prosthodontist in Mahalakshmi Layout, Bengaluru`,
  description: `Book a dental consultation with Dr. Akshatha V, MDS Prosthodontist in Mahalakshmi Layout, Bengaluru. Call ${site.phoneDisplay} or request an appointment online. Open daily 11 AM – 9:30 PM.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact & Book Appointment | ${site.name}, Bengaluru`,
    description: `Book a consultation at ${site.name}, ${site.area}, Bengaluru. Open daily 11 AM – 9:30 PM. Call or WhatsApp ${site.phoneDisplay}.`,
    url: "/contact",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Contact & Book", item: `${site.url}/contact` },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="bg-bg-soft pt-28 pb-12">
        <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-blue">Home</Link></li>
              <li aria-hidden>/</li>
              <li className="text-navy font-semibold">Contact &amp; Book</li>
            </ol>
          </nav>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Mahalakshmi Layout, Bengaluru</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">Book Your Consultation</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              Limited appointments available daily — open 11 AM to 9:30 PM. We confirm on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Clinic info */}
          <div>
            <h2 className="text-2xl font-bold">Clinic Details</h2>
            <ul className="mt-6 space-y-5 text-sm leading-relaxed text-navy-soft">
              <li>
                <strong className="block text-navy mb-1">Address</strong>
                <address className="not-italic text-muted">
                  K M Arcade, opp. Swimming Pool &amp; Bus Stop,<br />
                  next to Buddha Statue, Mahalakshmi Layout,<br />
                  Bengaluru, Karnataka 560096
                </address>
                <a
                  href={`https://www.google.com/maps/search/Akshatha+Dental+Clinic+Mahalakshmi+Layout+Bengaluru`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-semibold text-blue hover:underline"
                >
                  Get directions on Google Maps →
                </a>
              </li>
              <li>
                <strong className="block text-navy mb-1">Phone</strong>
                <a href={`tel:${site.phone}`} className="text-blue hover:underline font-semibold">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <strong className="block text-navy mb-1">Hours</strong>
                <span className="text-muted">11:00 AM – 9:30 PM, Monday to Sunday</span>
              </li>
              <li>
                <strong className="block text-navy mb-1">Email</strong>
                <a href={`mailto:${site.email}`} className="text-blue hover:underline">
                  {site.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`tel:${site.phone}`} variant="secondary">
                📞 Call Now
              </Button>
              <Button
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  "Hi, I would like to book a dental consultation."
                )}`}
              >
                💬 WhatsApp
              </Button>
            </div>

            {/* Nearby areas */}
            <div className="mt-8 rounded-2xl border border-line bg-bg-soft p-5">
              <h3 className="font-semibold text-navy mb-2 text-sm">Serving Patients From</h3>
              <p className="text-xs text-muted leading-relaxed">
                Mahalakshmi Layout · Rajajinagar · Malleshwaram · Basaveshwaranagar ·
                Vijayanagar · Yeshwanthpur · Sadashivanagar · Mathikere and across Bengaluru.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-sm)]">
              <iframe
                title={`${site.name} location — Mahalakshmi Layout, Bengaluru`}
                src={site.mapsEmbed}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Google Map showing Akshatha Dental Clinic in Mahalakshmi Layout, Bengaluru"
              />
            </div>
          </div>

          {/* Right: Booking form */}
          <div id="book">
            <AppointmentForm />
          </div>
        </div>
      </Section>
    </>
  );
}
