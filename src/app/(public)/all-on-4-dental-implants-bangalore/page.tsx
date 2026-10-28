import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: `All-on-4 Dental Implants in Bengaluru — Full Arch Restoration | ${site.name}`,
  description: `All-on-4 dental implants in Bengaluru from ₹2,50,000 for a full arch. Replace all teeth with just 4 implants. MDS Prosthodontist Dr. Akshatha V, Mahalakshmi Layout. Consultation includes CBCT scan review.`,
  alternates: { canonical: "/all-on-4-dental-implants-bangalore" },
  openGraph: {
    title: `All-on-4 Dental Implants in Bengaluru — Full Arch Restoration`,
    description: `Replace a full arch of teeth with 4 implants. Indicative cost from ₹2,50,000. MDS Prosthodontist, Mahalakshmi Layout, Bengaluru.`,
    url: "/all-on-4-dental-implants-bangalore",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
    { "@type": "ListItem", position: 3, name: "Dental Implants", item: `${site.url}/services/dental-implants` },
    {
      "@type": "ListItem",
      position: 4,
      name: "All-on-4 Dental Implants Bengaluru",
      item: `${site.url}/all-on-4-dental-implants-bangalore`,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much do All-on-4 dental implants cost in Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All-on-4 dental implant costs in Bengaluru are indicatively in the range of ₹2,50,000 to ₹4,00,000 per jaw at Akshatha Dental Clinic, depending on the implant system, prosthesis material, and clinical complexity. A personalised quote is provided after a CBCT scan and consultation.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between All-on-4 and All-on-6 implants?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All-on-4 uses 4 implants to support a full arch of 10–12 teeth. All-on-6 uses 6 implants for additional support — typically recommended where bone quality is lower or when the patient requires greater long-term stability. Your prosthodontist will recommend the right option based on your CBCT scan and bone assessment.",
      },
    },
    {
      "@type": "Question",
      name: "Who is a candidate for All-on-4 dental implants?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All-on-4 is suitable for patients who have lost most or all of their teeth, or whose remaining teeth are severely compromised and need extraction. Adequate jawbone volume is required for implant placement — though All-on-4 is specifically designed to work with angled implants to avoid bone grafting in many cases. A CBCT scan is needed to assess suitability.",
      },
    },
    {
      "@type": "Question",
      name: "How long do All-on-4 implants last?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The titanium implant posts in an All-on-4 procedure can last 20+ years with good oral hygiene and regular dental check-ups. The prosthesis (the fixed bridge on top) typically lasts 10–15 years before replacement may be needed. The longevity depends on bite forces, hygiene maintenance, and whether you use a night guard if you grind your teeth.",
      },
    },
    {
      "@type": "Question",
      name: "Is All-on-4 treatment painful?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The All-on-4 procedure is performed under local anaesthesia, so you will not feel pain during surgery. Post-operative discomfort (mild swelling, soreness) for 3–5 days is managed with prescribed pain relief. Most patients describe the recovery as more comfortable than expected.",
      },
    },
  ],
};

const medicalProcedureSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "All-on-4 Dental Implants",
  alternateName: ["All-on-4", "Full Arch Implants", "Teeth-in-a-Day"],
  description:
    "All-on-4 dental implants replace a full arch of missing teeth using just 4 strategically angled titanium implants, supporting a fixed prosthetic bridge. A permanent, non-removable alternative to dentures for patients with significant tooth loss.",
  procedureType: "https://schema.org/TherapeuticProcedure",
  bodyLocation: "Jaw (maxilla or mandible)",
  preparation:
    "CBCT scan and clinical consultation to assess bone volume and implant sites. Full medical history review. Pre-surgical extraction of any remaining compromised teeth if required.",
  followup:
    "Review at 2 weeks for healing assessment. Final prosthesis fitted at 3–6 months after osseointegration. Annual maintenance thereafter.",
  url: `${site.url}/all-on-4-dental-implants-bangalore`,
  provider: { "@id": `${site.url}/#clinic` },
  performer: { "@id": `${site.url}/about#doctor` },
};

const TIERS = [
  {
    type: "All-on-4 (Single Jaw)",
    range: "₹2,50,000 – ₹4,00,000",
    desc: "4 implants supporting a full arch of 10–12 fixed teeth. Most cases. Indicative cost — quoted after CBCT.",
    popular: true,
  },
  {
    type: "All-on-6 (Single Jaw)",
    range: "₹3,50,000 – ₹5,00,000",
    desc: "6 implants for additional support. Recommended when bone quality requires more anchor points.",
    popular: false,
  },
  {
    type: "Both Jaws (Upper + Lower)",
    range: "₹5,00,000 – ₹9,00,000",
    desc: "Full-mouth restoration — both arches treated together. Combined cases often have a more favourable overall plan.",
    popular: false,
  },
  {
    type: "Zygomatic / Basal Implants",
    range: "On consultation",
    desc: "For patients with severe bone loss who are not suitable for standard All-on-4. Uses the cheekbone or basal bone.",
    popular: false,
  },
];

const STEPS = [
  { step: "01", title: "Consultation & CBCT Scan", body: "3D scan assesses bone volume, density, and sinus position to determine the optimal implant angle and position." },
  { step: "02", title: "Extraction (if needed)", body: "Failing teeth are removed. In many cases implants are placed the same day as extraction." },
  { step: "03", title: "Implant Placement", body: "4–6 titanium implants placed under local anaesthesia. The posterior implants are angled to maximise bone contact and avoid nerve structures." },
  { step: "04", title: "Temporary Prosthesis", body: "A fixed temporary bridge is placed on the same day so you leave the clinic with teeth. Not the final prosthesis." },
  { step: "05", title: "Healing Phase", body: "Implants fuse with the jawbone (osseointegration) over 3–6 months. A soft diet is recommended during this period." },
  { step: "06", title: "Final Bridge Fitting", body: "The permanent, custom prosthesis (zirconia or acrylic on titanium frame) is fitted once osseointegration is confirmed." },
];

const COMPARE = [
  { aspect: "Number of implants", allOn4: "4 per jaw", dentures: "0" },
  { aspect: "Fixed or removable", allOn4: "Fixed (screw-retained)", dentures: "Removable" },
  { aspect: "Bone stimulation", allOn4: "Yes — prevents bone loss", dentures: "No — bone continues to resorb" },
  { aspect: "Eating ability", allOn4: "Normal diet", dentures: "Restricted (hard foods difficult)" },
  { aspect: "Longevity", allOn4: "20+ years (implant post)", dentures: "5–8 years typical" },
  { aspect: "Stability", allOn4: "No movement, no adhesive", dentures: "Can slip, especially lower jaw" },
];

export default function AllOn4Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedureSchema) }} />

      {/* Hero */}
      <section className="bg-navy text-white pt-28 pb-16 px-6 text-center">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex justify-center items-center gap-1.5 text-xs text-white/50 flex-wrap">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/services/dental-implants" className="hover:text-white">Dental Implants</Link></li>
            <li aria-hidden>/</li>
            <li className="text-white/80">All-on-4</li>
          </ol>
        </nav>
        <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">Full Arch Restoration</p>
        <h1 className="text-4xl font-extrabold mb-4 text-balance">
          All-on-4 Dental Implants in Bengaluru
        </h1>
        <p className="text-white/70 max-w-xl mx-auto text-lg mb-6">
          Replace a full jaw of teeth with just{" "}
          <span className="text-white font-bold">4 implants</span>. Fixed, permanent,
          and functional — not a denture. Indicative cost from{" "}
          <span className="text-white font-bold">₹2,50,000 per arch</span>.
        </p>
        <Link
          href="/contact#book"
          className="inline-block rounded-full bg-blue px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
        >
          Book a Consultation
        </Link>
        <p className="mt-4 text-xs text-white/40">Bring your recent X-rays or OPG. CBCT scan available at clinic.</p>
      </section>

      {/* Pricing tiers */}
      <section className="py-16 px-6 bg-bg-soft">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy text-center mb-2">All-on-4 Cost in Bengaluru</h2>
          <p className="text-center text-muted text-sm mb-10">
            All prices are indicative. A personalised quote follows a CBCT scan and consultation.
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
            Cost includes implant posts, abutments, and fixed prosthesis. Extractions, CBCT scan, and bone grafts (if needed) quoted separately.
          </p>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            <strong>NMC Compliance note:</strong> Prices shown are indicative ranges for informational purposes. Final treatment cost is determined after clinical examination and imaging. No guarantees of specific outcomes are implied.
          </div>
        </div>
      </section>

      {/* Procedure steps */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy mb-2">How All-on-4 Treatment Works</h2>
          <p className="text-muted text-sm mb-10">A staged process designed for predictable, long-lasting outcomes.</p>
          <div className="space-y-0 divide-y divide-line border border-line rounded-2xl overflow-hidden">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-5 p-5 bg-white hover:bg-bg-soft transition-colors">
                <span className="flex-shrink-0 text-2xl font-extrabold text-blue/25 w-8 text-right leading-tight">{s.step}</span>
                <div>
                  <p className="font-bold text-navy text-sm">{s.title}</p>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All-on-4 vs Dentures */}
      <section className="py-16 px-6 bg-bg-soft">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy mb-2">All-on-4 vs Complete Dentures</h2>
          <p className="text-muted text-sm mb-8">Both replace missing teeth. These are the key differences.</p>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-5 py-3.5 font-semibold">Feature</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-blue">All-on-4 Implants</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-white/60">Complete Dentures</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? "bg-white" : "bg-bg-soft"}>
                    <td className="px-5 py-3.5 font-medium text-navy">{row.aspect}</td>
                    <td className="px-5 py-3.5 text-navy font-semibold">{row.allOn4}</td>
                    <td className="px-5 py-3.5 text-muted">{row.dentures}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-xs text-muted text-center">
            Interested in dentures?{" "}
            <Link href="/services/dentures" className="text-blue hover:underline">
              See our denture options →
            </Link>
          </p>
        </div>
      </section>

      {/* Why specialist */}
      <section className="py-16 px-6 bg-navy text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">Why it matters</p>
          <h2 className="text-2xl font-extrabold mb-4 text-balance">All-on-4 Is a Specialised Surgical Procedure</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed mb-8">
            The angled implant placement in All-on-4 requires precise 3D surgical planning. An MDS Prosthodontist
            is trained in both the surgical and prosthetic components — ensuring the implants are positioned
            correctly and the final bridge fits, functions, and looks right.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { stat: "MDS", label: "Post-graduate specialist in Prosthodontics & Implantology" },
              { stat: "CBCT", label: "3D imaging used for precision implant placement planning" },
              { stat: "Fixed", label: "Permanent screw-retained prosthesis — not removable" },
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
            <Link href="/services/dental-implants" className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors">
              Dental Implants Overview →
            </Link>
            <Link href="/dental-implant-cost-bangalore" className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors">
              Single Tooth Implant Cost →
            </Link>
            <Link href="/services/full-mouth-rehabilitation" className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-soft transition-colors">
              Full Mouth Rehabilitation →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-2xl rounded-3xl bg-navy text-white p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Get Your All-on-4 Treatment Plan</h2>
          <p className="text-white/70 mb-6 text-sm leading-relaxed">
            Dr. Akshatha V will review your CBCT scan, assess your bone condition,
            and provide a detailed, personalised treatment plan with cost breakdown.
            Same-day appointments available.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact#book"
              className="inline-block rounded-full bg-blue px-8 py-3 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
            >
              Book Consultation
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}?text=Hi%2C+I%27d+like+to+know+more+about+All-on-4+dental+implants+and+the+cost+in+Bengaluru.`}
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
