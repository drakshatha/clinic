export const revalidate = 86400; // 24 hours

import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { blogPosts, formatDate } from "@/lib/blog";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: `Dental Health Blog | Patient Guides — ${site.shortName}`,
  description: `Expert guides on dental implants, prosthodontic treatments, and oral health from Dr. Akshatha V, MDS Prosthodontist in Bengaluru.`,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Dental Health Blog | ${site.name}`,
    description: `Patient guides and expert advice on implants, crowns, dentures, and smile restoration from a specialist prosthodontist in Bengaluru.`,
    url: "/blog",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
  ],
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

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
              <li className="text-navy font-semibold">Blog</li>
            </ol>
          </nav>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Patient Guides &amp; Advice</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">Dental Health Blog</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              Expert guidance on implants, crowns, dentures, and smile restoration — written by a specialist prosthodontist.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <article key={post.slug} className="flex flex-col rounded-3xl border border-line bg-white overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-full bg-blue/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-muted">{post.readingMinutes} min read</span>
                </div>
                <h2 className="text-lg font-bold text-navy leading-snug mb-3">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted leading-relaxed flex-1">{post.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <time dateTime={post.publishedAt} className="text-xs text-muted">
                    {formatDate(post.publishedAt)}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-semibold text-blue hover:underline"
                  >
                    Read article →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-navy p-8 text-center text-white md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">Have a question not covered here?</h2>
          <p className="mt-3 text-white/70 max-w-lg mx-auto">
            Book a consultation with Dr. Akshatha V — specialist answers for your specific situation.
          </p>
          <Link
            href="/contact#book"
            className="mt-6 inline-block rounded-full bg-blue px-7 py-3 text-sm font-bold text-white hover:bg-blue/90 transition-colors"
          >
            Book a Consultation
          </Link>
        </div>
      </Section>
    </>
  );
}
