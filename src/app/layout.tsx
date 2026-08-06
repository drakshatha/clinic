import type { Metadata } from "next";
import { Manrope, Lato } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Best Prosthodontist in ${site.city} | Dental Implants Specialist | ${site.shortName}`,
    template: `%s | ${site.shortName}`,
  },
  description: `${site.doctor}, MDS Prosthodontist in ${site.area}, ${site.city}. Dental implants, full mouth rehabilitation, crowns, dentures & smile makeovers. Book consultation today.`,
  keywords: [
    `best prosthodontist in ${site.city}`,
    "dental implants specialist",
    "full mouth rehabilitation expert",
    "smile makeover clinic",
    site.area,
  ],
  openGraph: {
    title: site.tagline,
    description: `Premium prosthodontic care by ${site.doctor} in ${site.city}.`,
    url: site.url,
    siteName: site.name,
    images: [{ url: "/images/family-smile-consultation.jpg" }],
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: site.name,
  image: `${site.url}/images/doctor-portrait-clean.png`,
  url: site.url,
  telephone: site.phone,
  medicalSpecialty: "Prosthodontics",
  address: {
    "@type": "PostalAddress",
    streetAddress: "K M Arcade, Mahalakshmi Layout",
    addressLocality: site.city,
    postalCode: "560096",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "11:00",
    closes: "21:30",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: site.rating,
    reviewCount: String(site.reviewCount),
  },
  employee: {
    "@type": "Physician",
    name: site.doctor,
    medicalSpecialty: "Prosthodontics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${lato.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
