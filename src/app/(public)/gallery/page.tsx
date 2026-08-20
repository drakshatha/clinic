import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllGallery } from "@/lib/db";
import { site } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Smile Transformation Gallery | Before & After — ${site.name}`,
  description: `See real smile transformations by Dr. Akshatha V, MDS Prosthodontist at ${site.name}, Bengaluru. Dental implants, crowns, full mouth rehabilitation, dentures and cosmetic smile makeovers.`,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: `Patient Smile Transformations | Before & After Gallery — ${site.name}`,
    description: `Before and after dental transformations by specialist prosthodontist Dr. Akshatha V in Mahalakshmi Layout, Bengaluru.`,
    url: "/gallery",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Gallery", item: `${site.url}/gallery` },
  ],
};

export default async function GalleryPage() {
  const cases = await getAllGallery(true);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-navy text-white pt-28 pb-16 px-6 text-center">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex justify-center items-center gap-1.5 text-xs text-white/50">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden>/</li>
            <li className="text-white/80">Gallery</li>
          </ol>
        </nav>
        <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">Real Results</p>
        <h1 className="text-4xl font-extrabold mb-4 text-balance">Smile Transformation Gallery</h1>
        <p className="text-white/70 max-w-xl mx-auto text-lg">
          Before &amp; after cases by {site.doctor}, MDS Prosthodontist in Bengaluru.
          Every smile is unique — see what&apos;s possible with specialist prosthodontic care.
        </p>
      </section>

      {/* Gallery */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          {cases.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-lg">Gallery coming soon — check back for transformation photos.</p>
              <Link
                href="/contact#book"
                className="mt-6 inline-block rounded-full bg-blue px-8 py-3 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
              >
                Book a Consultation
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((c) => (
                  <article key={c.id} className="rounded-3xl border border-line bg-surface overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-2">
                      <div className="relative">
                        <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded">BEFORE</div>
                        <div className="relative aspect-square bg-gray-100">
                          <Image
                            src={c.beforeUrl}
                            alt={`Before dental treatment — ${c.title}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 250px"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute top-2 left-2 z-10 bg-navy/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">AFTER</div>
                        <div className="relative aspect-square bg-gray-100">
                          <Image
                            src={c.afterUrl}
                            alt={`After dental treatment result — ${c.title}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 250px"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h2 className="text-base font-bold text-navy">{c.title}</h2>
                      {c.treatment && (
                        <p className="text-xs text-blue font-semibold mt-1 uppercase tracking-wide">{c.treatment}</p>
                      )}
                      {c.description && (
                        <p className="text-sm text-muted mt-2 leading-relaxed">{c.description}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-16 rounded-3xl bg-navy text-white p-10 text-center">
                <h2 className="text-2xl font-bold mb-3">Ready for your transformation?</h2>
                <p className="text-white/70 mb-6">
                  Book a consultation with {site.doctor} to discuss your smile goals and treatment options.
                </p>
                <Link
                  href="/contact#book"
                  className="inline-block rounded-full bg-blue px-8 py-3 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
                >
                  Book Appointment
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
