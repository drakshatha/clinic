export const revalidate = 86400; // 24 hours

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, services } from "@/lib/site";
import { blogPosts, getBlogPost, formatDate } from "@/lib/blog";
import { Section } from "@/components/ui/Section";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: site.doctor }],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [site.doctor],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedService = post.relatedService
    ? services.find((s) => s.slug === post.relatedService)
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Person",
      "@id": `${site.url}/about#doctor`,
      name: site.doctor,
      jobTitle: site.credentials,
      url: `${site.url}/about`,
    },
    publisher: {
      "@id": `${site.url}/#clinic`,
    },
    mainEntityOfPage: `${site.url}/blog/${slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}/blog/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="bg-bg-soft pt-28 pb-10">
        <div className="mx-auto w-[min(720px,calc(100%-2rem))]">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li><Link href="/" className="hover:text-blue">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/blog" className="hover:text-blue">Blog</Link></li>
              <li aria-hidden>/</li>
              <li className="text-navy font-semibold line-clamp-1">{post.title}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className="rounded-full bg-blue/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue">
              {post.category}
            </span>
            <span className="text-xs text-muted">{post.readingMinutes} min read</span>
          </div>

          <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-[2.6rem]" style={{ textWrap: "balance" }}>
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">{post.description}</p>

          <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            <div className="h-9 w-9 rounded-full bg-blue/10 grid place-items-center text-sm font-bold text-blue">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">{site.doctor}</p>
              <p className="text-xs text-muted">{site.credentials} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></p>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <Section>
        <div className="mx-auto w-[min(720px,100%)]">
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Related service CTA */}
          {relatedService && (
            <div className="mt-12 rounded-3xl border border-blue/20 bg-blue/5 p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-blue mb-2">Related Treatment</p>
              <h3 className="text-xl font-bold text-navy">{relatedService.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{relatedService.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/services/${relatedService.slug}`}
                  className="rounded-full bg-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-blue/90 transition-colors"
                >
                  Learn about {relatedService.shortTitle}
                </Link>
                <Link
                  href="/contact#book"
                  className="rounded-full border border-blue px-5 py-2.5 text-sm font-bold text-blue hover:bg-blue/5 transition-colors"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          )}

          {/* Author box */}
          <div className="mt-10 rounded-3xl border border-line bg-bg-soft p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Written by</p>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-blue/10 grid place-items-center text-lg font-bold text-blue">
                A
              </div>
              <div>
                <p className="font-bold text-navy">{site.doctor}</p>
                <p className="text-sm text-muted mt-0.5">{site.credentials} · {site.yearsExperience}+ years specialist practice · Akshatha Dental Clinic, Bengaluru</p>
                <Link href="/about" className="mt-2 inline-block text-xs font-semibold text-blue hover:underline">
                  About Dr. Akshatha V →
                </Link>
              </div>
            </div>
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link href="/blog" className="text-sm font-semibold text-blue hover:underline">
              ← Back to all articles
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
