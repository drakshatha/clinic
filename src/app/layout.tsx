import type { Metadata } from "next";
import { Manrope, Lato } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Prosthodontist in Bengaluru | Dental Implants & Smile Restoration | ${site.doctor}`,
    template: `%s | ${site.shortName}`,
  },
  description: `${site.doctor}, MDS Prosthodontist & Implantologist in ${site.area}, ${site.city}. Expert in dental implants, full mouth rehabilitation, crowns, dentures & smile makeovers. Book a consultation today.`,
  keywords: [
    "prosthodontist in Bengaluru",
    "dental implants Bengaluru",
    "full mouth rehabilitation Bengaluru",
    "MDS prosthodontist Mahalakshmi Layout",
    "smile makeover Bengaluru",
    "dental crowns Bengaluru",
    "dentures specialist Bengaluru",
  ],
  authors: [{ name: site.doctor }],
  creator: site.doctor,
  publisher: site.name,
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    title: `Prosthodontist in Bengaluru | ${site.doctor}`,
    description: `Expert dental implants, full mouth rehabilitation, crowns, dentures & smile makeovers by ${site.doctor}, MDS Prosthodontist in ${site.area}, ${site.city}.`,
    url: site.url,
    siteName: site.name,
    images: [
      {
        url: "/images/family-smile-consultation.jpg",
        width: 1200,
        height: 630,
        alt: `${site.doctor} — Specialist Prosthodontist in Bengaluru`,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Prosthodontist in Bengaluru | ${site.doctor}`,
    description: `Expert dental implants, full mouth rehabilitation, crowns & smile makeovers in ${site.area}, ${site.city}.`,
    images: ["/images/family-smile-consultation.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// ── Clinic / Dentist schema ────────────────────────────────────────────────────
const clinicSchema = {
  "@context": "https://schema.org",
  "@type": ["Dentist", "MedicalBusiness"],
  "@id": `${site.url}/#clinic`,
  name: site.name,
  alternateName: "Dr. Akshatha Dental Clinic",
  image: `${site.url}/images/doctor-portrait-clean.png`,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  medicalSpecialty: "Prosthodontics",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "K M Arcade, opp. Swimming Pool & Bus Stop, next to Buddha Statue",
    addressLocality: "Mahalakshmi Layout",
    addressRegion: "Karnataka",
    addressCountry: "IN",
    postalCode: "560096",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 13.0026,
    longitude: 77.5566,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "11:00",
      closes: "21:30",
    },
  ],
  employee: {
    "@type": "Physician",
    "@id": `${site.url}/about#doctor`,
    name: site.doctor,
    jobTitle: "MDS Prosthodontist & Implantologist",
    medicalSpecialty: "Prosthodontics",
    url: `${site.url}/about`,
    image: `${site.url}/images/doctor-portrait-clean.png`,
  },
  hasMap: site.mapsEmbed,
  sameAs: [site.googleReviewUrl],
};

// ── WebSite schema with SearchAction ──────────────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  description: `Specialist prosthodontic clinic in ${site.area}, ${site.city}`,
  publisher: { "@id": `${site.url}/#clinic` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${manrope.variable} ${lato.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
