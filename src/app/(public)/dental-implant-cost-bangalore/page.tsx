import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: `Dental Implant Cost in Bengaluru — Starting ₹25,000 | ${site.name}`,
  description: `Dental implant cost in Bengaluru starts from ₹25,000 per tooth at Akshatha Dental Clinic, Mahalakshmi Layout. MDS Prosthodontist Dr. Akshatha V. Transparent pricing, no hidden fees. Book a consultation.`,
  alternates: { canonical: "/dental-implant-cost-bangalore" },
  openGraph: {
    title: `Dental Implant Cost in Bengaluru — Starting ₹25,000`,
    description: `Transparent dental implant pricing in Bengaluru. Single tooth implants from ₹25,000. Specialist prosthodontist Dr. Akshatha V, Mahalakshmi Layout.`,
    url: "/dental-implant-cost-bangalore",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Dental Implant Cost Bengaluru",
      item: `${site.url}/dental-implant-cost-bangalore`,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does a tooth implant cost in Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dental implant costs in Bengaluru start from ₹25,000 per tooth at Akshatha Dental Clinic. The total cost depends on the implant brand, crown material (zirconia or porcelain-fused-to-metal), and whether a bone graft is needed. A full cost breakdown is provided after a clinical examination.",
      },
    },
    {
      "@type": "Question",
      name: "Why do dental implants cost so much?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dental implants involve a titanium post that fuses with your jawbone (osseointegration), a customised abutment, and a crown. The cost reflects the surgical procedure, specialist expertise (prosthodontist), premium implant components, and the crown fabrication by a dental laboratory. Implants are a permanent solution that can last 20+ years, unlike dentures or bridges.",
      },
    },
    {
      "@type": "Question",
      name: "Are there cheaper implant options in Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Implant costs vary based on the implant system used (international brands like Straumann, Nobel vs. domestic options), the specialist's experience, and what is included in the package. At Akshatha Dental Clinic, costs start from ₹25,000 and include the implant, abutment, and crown. We recommend choosing a qualified prosthodontist (MDS) for implant treatment — implant failure is costly to correct.",
      },
    },
    {
      "@type": "Question",
      name: "What is included in the dental implant cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our implant cost includes the titanium implant post, abutment, and permanent crown. Pre-implant X-rays (OPG/CBCT) and post-procedure follow-up visits are charged separately. If bone grafting is required, it is quoted during your consultation.",
      },
    },
    {
      "@type": "Question",
      name: "How many visits are needed for a dental implant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A standard single implant typically requires 3–4 visits over 3–6 months: an initial consultation and X-rays, the implant placement surgery, a healing review at 2–3 months, and the final crown fitting.",
      },
    },
  ],
};

const TIERS = [
  {
    type: "Single Tooth Implant",
    range: "₹25,000 – ₹40,000",
    desc: "One missing tooth replaced with a titanium implant and zirconia or PFM crown.",
    popular: true,
  },
  {
    type: "Multiple Implants",
    range: "₹25,000 / tooth",
    desc: "Two or more teeth replaced. Cost per implant is the same; a treatment plan is discussed at consultation.",
    popular: false,
  },
  {
    type: "Implant + Bone Graft",
    range: "₹35,000 – ₹60,000",
    desc: "When insufficient bone is present, a graft procedure is performed alongside implant placement.",
    popular: false,
  },
  {
    type: "Full-Arch (All-on-4 / All-on-6)",
    range: "On consultation",
    desc: "Complete jaw restoration using 4–6 implants supporting a full-arch prosthesis. Quoted individually after CBCT scan.",
    popular: false,
  },
];

const FACTORS = [
  { label: "Implant brand", detail: "International systems (Straumann, Nobel) vs. domestic. All options use CE/FDA-cleared implants." },
  { label: "Crown material", detail: "Zirconia crowns look most natural and are stronger. Porcelain-fused-to-metal (PFM) is a cost-effective alternative." },
  { label: "Bone condition", detail: "If bone loss is present, a graft is needed before or during implant placement, adding to the cost and healing time." },
  { label: "Number of implants", detail: "Single tooth vs. multiple implants vs. full-arch restoration are priced differently." },
  { label: "Diagnostic imaging", detail: "An OPG X-ray (₹500–₹800) or CBCT scan (₹2,000–₹3,500) is needed to plan treatment precisely." },
];

export default function DentalImplantCostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-navy text-white pt-28 pb-16 px-6 text-center">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex justify-center items-center gap-1.5 text-xs text-white/50">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li aria-hidden>/</li>
            <li className="text-white/80">Implant Cost</li>
          </ol>
        </nav>
        <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">Transparent Pricing</p>
        <h1 className="text-4xl font-extrabold mb-4 text-balance">
          Dental Implant Cost in Bengaluru
        </h1>
        <p className="text-white/70 max-w-xl mx-auto text-lg mb-6">
          Starting from <span className="text-white font-bold">₹25,000 per tooth</span> — no hidden fees,
          no surprises. Exact cost determined after a clinical examination.
        </p>
        <Link
          href="/contact#book"
          className="inline-block rounded-full bg-blue px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
        >
          Book a Free Consultation
        </Link>
        <p className="mt-4 text-xs text-white/40">Consultation includes X-ray review and treatment plan discussion</p>
      </section>

      {/* Pricing tiers */}
      <section className="py-16 px-6 bg-bg-soft">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy text-center mb-2">Implant Cost Breakdown</h2>
          <p className="text-center text-muted text-sm mb-10">
            All prices are indicative. A personalised quote is provided after your consultation.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {TIERS.map((t) => (
              <div
                key={t.type}
                className={`rounded-2xl border bg-white p-6 relative ${
                  t.popular ? "border-blue shadow-md" : "border-line shadow-sm"
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-5 bg-blue text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most common
                  </span>
                )}
                <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1">{t.type}</p>
                <p className="text-2xl font-extrabold text-navy mb-3">{t.range}</p>
                <p className="text-sm text-muted leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            Prices include implant post, abutment, and permanent crown. Imaging and bone graft (if needed) quoted separately.
          </p>
        </div>
      </section>

      {/* What affects cost */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy mb-2">What Affects the Cost?</h2>
          <p className="text-muted text-sm mb-8">
            Every patient&apos;s case is different. These are the key variables that determine the final cost.
          </p>
          <div className="divide-y divide-line border border-line rounded-2xl overflow-hidden">
            {FACTORS.map((f) => (
              <div key={f.label} className="flex gap-4 p-5 bg-white hover:bg-bg-soft transition-colors">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue/10 text-blue text-xs font-bold flex items-center justify-center">→</span>
                <div>
                  <p className="font-semibold text-navy text-sm">{f.label}</p>
                  <p className="text-sm text-muted mt-0.5 leading-relaxed">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why specialist matters */}
      <section className="py-16 px-6 bg-navy text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">Why it matters</p>
          <h2 className="text-2xl font-extrabold mb-4 text-balance">Why Choose an MDS Prosthodontist for Implants?</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed mb-8">
            Dental implants are a surgical and prosthetic procedure. A Prosthodontist (MDS — 3-year post-graduate specialist)
            is trained in the full scope of implant treatment: from surgical placement to crown design and bite correction.
            This matters more than cost — an implant placed incorrectly is expensive to retrieve and redo.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { stat: "MDS", label: "Specialist qualification — Prosthodontics & Implantology" },
              { stat: "11+ yrs", label: "Clinical experience in implant and restorative dentistry" },
              { stat: "1,000+", label: "Patients treated at Akshatha Dental Clinic" },
            ].map((item) => (
              <div key={item.stat} className="rounded-xl bg-white/10 p-5">
                <p className="text-2xl font-extrabold text-white mb-1">{item.stat}</p>
                <p className="text-sm text-white/60 leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy mb-8">Frequently Asked Questions</h2>
          <div className="divide-y divide-line border border-line rounded-2xl overflow-hidden">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="group bg-white">
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 hover:bg-bg-soft transition-colors list-none">
                  <span className="font-semibold text-navy text-sm leading-snug">{faq.name}</span>
                  <span className="flex-shrink-0 text-muted group-open:rotate-180 transition-transform text-lg">↓</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-muted leading-relaxed">
                  {faq.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related pages */}
      <section className="py-8 px-6 bg-bg-soft">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/services/dental-implants" className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors">
              Dental Implants Overview →
            </Link>
            <Link href="/all-on-4-dental-implants-bangalore" className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors">
              All-on-4 dental implants cost →
            </Link>
            <Link href="/blog/dental-implants-bengaluru-complete-guide" className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors">
              Complete implants guide →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-bg-soft">
        <div className="mx-auto max-w-2xl rounded-3xl bg-navy text-white p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Get Your Personalised Implant Quote</h2>
          <p className="text-white/70 mb-6 text-sm leading-relaxed">
            Book a consultation with Dr. Akshatha V. Bring your latest X-rays if you have them —
            or we&apos;ll arrange imaging at the clinic. Same-day appointments available.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact#book"
              className="inline-block rounded-full bg-blue px-8 py-3 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
            >
              Book Appointment
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}?text=Hi%2C+I%27d+like+to+know+the+dental+implant+cost+for+my+case.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
          <p className="mt-5 text-xs text-white/40">
            {site.address} · Open {site.hours}
          </p>
        </div>
      </section>
    </>
  );
}
