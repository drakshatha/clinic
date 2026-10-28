import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: `Smile Makeover Cost in Bengaluru — Veneers, Crowns & Cosmetic Dentistry | ${site.name}`,
  description: `Smile makeover costs in Bengaluru from ₹3,000 per tooth (composite bonding) to ₹25,000 per tooth (porcelain veneers). MDS Prosthodontist Dr. Akshatha V, Mahalakshmi Layout. Indicative pricing — confirmed at consultation.`,
  alternates: { canonical: "/smile-makeover-cost-bangalore" },
  openGraph: {
    title: `Smile Makeover Cost in Bengaluru — Veneers, Crowns & Cosmetic Dentistry`,
    description: `Indicative smile makeover costs in Bengaluru. Composite bonding from ₹3,000/tooth · Porcelain veneers from ₹12,000/tooth. MDS Prosthodontist, Mahalakshmi Layout.`,
    url: "/smile-makeover-cost-bangalore",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
    { "@type": "ListItem", position: 3, name: "Smile Makeover", item: `${site.url}/services/cosmetic-smile-makeover` },
    {
      "@type": "ListItem",
      position: 4,
      name: "Smile Makeover Cost Bengaluru",
      item: `${site.url}/smile-makeover-cost-bangalore`,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does a smile makeover cost in Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Smile makeover costs in Bengaluru vary widely based on the treatments involved. Composite bonding (quick fixes, chips, gaps) is indicatively ₹3,000–₹8,000 per tooth. Porcelain veneers are indicatively ₹12,000–₹25,000 per tooth. A full smile makeover involving 6–10 veneers plus gum work is typically ₹70,000–₹2,50,000+ total. A personalised quote is provided at consultation after examining your teeth and goals.",
      },
    },
    {
      "@type": "Question",
      name: "Is a smile makeover permanent?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porcelain veneers last 10–20 years with proper care. Zirconia crowns last 15–25 years. Composite bonding lasts 3–7 years and can be repaired. Teeth whitening results last 1–3 years depending on diet and habits. The initial tooth preparation for veneers is irreversible — enamel is reduced to bond the veneer — so porcelain veneers are a long-term commitment.",
      },
    },
    {
      "@type": "Question",
      name: "How many appointments does a smile makeover take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A consultation and design session takes 1–2 appointments. Composite bonding can be completed in 1–2 visits. Porcelain veneers typically require 3–4 visits over 4–6 weeks (consultation, preparation, temporaries, and final fitting). More complex makeovers involving implants or crowns on multiple teeth extend the timeline further.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between composite veneers and porcelain veneers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Composite veneers are sculpted chair-side from tooth-coloured resin — faster and cheaper (₹3,000–₹8,000/tooth), but less stain-resistant and shorter-lived (3–7 years). Porcelain veneers are lab-fabricated ceramic shells — more natural-looking, more durable (10–20 years), and stain-resistant, but higher cost (₹12,000–₹25,000/tooth) and irreversible. For front-of-smile cases, porcelain generally gives a superior long-term result.",
      },
    },
    {
      "@type": "Question",
      name: "Does teeth whitening alone count as a smile makeover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Teeth whitening is often a component of a smile makeover, but it is a standalone cosmetic procedure, not a full makeover. A smile makeover typically combines whitening with veneers, bonding, or crowns to also change the shape, size, and symmetry of teeth — not just the colour. If your only concern is tooth colour, professional whitening alone may be sufficient.",
      },
    },
  ],
};

const TIERS = [
  {
    type: "Composite Bonding",
    range: "₹3,000 – ₹8,000 per tooth",
    total: "₹18,000–₹48,000 for 6 front teeth",
    desc: "Chair-side sculpted resin. Fixes chips, gaps, minor shapes. No lab required — done in one visit. Lasts 3–7 years.",
    popular: false,
  },
  {
    type: "Porcelain Veneers",
    range: "₹12,000 – ₹25,000 per tooth",
    total: "₹72,000–₹1,50,000 for 6 front teeth",
    desc: "Lab-fabricated ceramic shells. Most natural-looking, stain-resistant, 10–20 year lifespan. 3–4 visits over 4–6 weeks.",
    popular: true,
  },
  {
    type: "Zirconia Crowns",
    range: "₹10,000 – ₹22,000 per tooth",
    total: "Used when tooth structure is compromised",
    desc: "Full-coverage ceramic crown. For broken, discoloured, or structurally weak teeth. 15–25 year lifespan.",
    popular: false,
  },
  {
    type: "Full Smile Makeover",
    range: "₹70,000 – ₹2,50,000+",
    total: "Veneers + whitening + gum contouring",
    desc: "Combination treatment: 6–10 veneers, optional whitening, optional gum reshaping. Designed as a complete smile transformation.",
    popular: false,
  },
];

const COMPONENTS = [
  { procedure: "Professional teeth whitening", range: "₹5,000 – ₹12,000", notes: "Per session; in-chair bleaching" },
  { procedure: "Composite bonding (per tooth)", range: "₹3,000 – ₹8,000", notes: "Chips, gaps, minor shape changes" },
  { procedure: "Porcelain veneer (per tooth)", range: "₹12,000 – ₹25,000", notes: "Lab-fabricated; 10–20 year life" },
  { procedure: "Zirconia crown (per tooth)", range: "₹10,000 – ₹22,000", notes: "For structurally compromised teeth" },
  { procedure: "Gum contouring", range: "₹8,000 – ₹20,000", notes: "Reshapes high/uneven gum line" },
  { procedure: "Dental implant + crown", range: "₹35,000 – ₹75,000", notes: "For missing teeth in the smile zone" },
  { procedure: "Teeth alignment (minor)", range: "On consultation", notes: "Aligners before cosmetic work if needed" },
];

const FACTORS = [
  { factor: "Number of teeth treated", impact: "High", detail: "6 front teeth vs 10 front + premolars changes cost significantly." },
  { factor: "Material choice", impact: "High", detail: "Composite vs porcelain veneers: cost difference is 3–4x per tooth." },
  { factor: "Gum work needed", impact: "Medium", detail: "Gummy smile correction or uneven gum line adds to the plan." },
  { factor: "Existing restorations", impact: "Medium", detail: "Old crowns or fillings may need replacing to match the new veneers." },
  { factor: "Teeth whitening inclusion", impact: "Low–Medium", detail: "Whitening is often done before or alongside veneers to determine shade target." },
  { factor: "Lab used", impact: "Medium", detail: "Premium dental labs produce more natural-looking veneers; cost reflects this." },
];

export default function SmileMakeoverCostPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-navy text-white pt-28 pb-16 px-6 text-center">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex justify-center items-center gap-1.5 text-xs text-white/50 flex-wrap">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/services/cosmetic-smile-makeover" className="hover:text-white">Smile Makeover</Link></li>
            <li aria-hidden>/</li>
            <li className="text-white/80">Cost</li>
          </ol>
        </nav>
        <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">Cosmetic Dentistry</p>
        <h1 className="text-4xl font-extrabold mb-4 text-balance">
          Smile Makeover Cost in Bengaluru
        </h1>
        <p className="text-white/70 max-w-xl mx-auto text-lg mb-6">
          Composite bonding from{" "}
          <span className="text-white font-bold">₹3,000/tooth</span> · Porcelain veneers from{" "}
          <span className="text-white font-bold">₹12,000/tooth</span>.
          Indicative pricing — personalised quote at consultation.
        </p>
        <Link
          href="/contact#book"
          className="inline-block rounded-full bg-blue px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
        >
          Book a Smile Consultation
        </Link>
        <p className="mt-4 text-xs text-white/40">Digital smile design available. Bring photos of your ideal smile.</p>
      </section>

      {/* Pricing tiers */}
      <section className="py-16 px-6 bg-bg-soft">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy text-center mb-2">Smile Makeover Pricing in Bengaluru</h2>
          <p className="text-center text-muted text-sm mb-10">
            All prices are indicative. A personalised quote follows a consultation and smile assessment.
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
                    Most popular
                  </span>
                )}
                <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1">{t.type}</p>
                <p className="text-xl font-extrabold text-navy mb-1">{t.range}</p>
                <p className="text-xs text-muted mb-3">{t.total}</p>
                <p className="text-sm text-muted leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            <strong>NMC Compliance note:</strong> Prices shown are indicative ranges for informational purposes. Final treatment cost is determined after clinical examination. No guarantees of specific outcomes are implied.
          </div>
        </div>
      </section>

      {/* Cost breakdown by component */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy mb-2">Component Cost Breakdown</h2>
          <p className="text-muted text-sm mb-8">Most smile makeovers combine 2–4 of these procedures.</p>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-5 py-3.5 font-semibold">Procedure</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-blue">Indicative Cost</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-white/60 hidden sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {COMPONENTS.map((row, i) => (
                  <tr key={row.procedure} className={i % 2 === 0 ? "bg-white" : "bg-bg-soft"}>
                    <td className="px-5 py-3.5 font-medium text-navy">{row.procedure}</td>
                    <td className="px-5 py-3.5 text-navy font-semibold">{row.range}</td>
                    <td className="px-5 py-3.5 text-muted hidden sm:table-cell text-xs">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What affects cost */}
      <section className="py-16 px-6 bg-bg-soft">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy mb-2">What Affects the Cost of a Smile Makeover?</h2>
          <p className="text-muted text-sm mb-8">Why two patients can have very different quotes for a "smile makeover."</p>
          <div className="space-y-3">
            {FACTORS.map((f) => (
              <div key={f.factor} className="rounded-xl border border-line bg-white p-5 flex gap-4">
                <div className="flex-shrink-0">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    f.impact === "High"
                      ? "bg-red-100 text-red-700"
                      : f.impact === "Medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {f.impact}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">{f.factor}</p>
                  <p className="text-sm text-muted mt-0.5 leading-relaxed">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why specialist */}
      <section className="py-16 px-6 bg-navy text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">Smile design expertise</p>
          <h2 className="text-2xl font-extrabold mb-4 text-balance">
            A Smile Makeover Is a Design Problem, Not Just a Dental Procedure
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed mb-8">
            Matching veneer proportions to your face, establishing the right shade, and ensuring
            the bite works correctly with the new restorations — this is what separates a natural-looking
            result from the "piano-key" look. An MDS Prosthodontist brings bite design expertise
            alongside aesthetic training.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { stat: "Digital", label: "Smile design mock-up before any irreversible treatment" },
              { stat: "MDS", label: "Post-graduate specialist in restorations, bite, and cosmetics" },
              { stat: "Trial", label: "Composite trial smile so you can see the result before committing" },
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

      {/* Related links */}
      <section className="py-8 px-6 bg-bg-soft">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/services/cosmetic-smile-makeover" className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors">
              Smile Makeover Overview →
            </Link>
            <Link href="/blog/smile-makeover-what-to-expect" className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors">
              What to Expect at Consultation →
            </Link>
            <Link href="/services/crowns-bridges" className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors">
              Crowns & Bridges →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-2xl rounded-3xl bg-navy text-white p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Get Your Personalised Smile Plan</h2>
          <p className="text-white/70 mb-6 text-sm leading-relaxed">
            Dr. Akshatha V will assess your teeth, discuss your smile goals,
            and show you a digital mock-up before any treatment begins.
            No pressure — just a clear picture of what's possible and what it costs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact#book"
              className="inline-block rounded-full bg-blue px-8 py-3 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
            >
              Book Consultation
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}?text=Hi%2C+I%27d+like+to+know+more+about+smile+makeover+options+and+cost+in+Bengaluru.`}
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
