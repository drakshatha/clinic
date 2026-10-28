import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Akshatha Dental Clinic",
  description: "Privacy policy for Akshatha Dental Clinic, Mahalakshmi Layout, Bengaluru.",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-[min(760px,calc(100%-2rem))] py-20 space-y-8 text-sm leading-relaxed text-muted">
      <div>
        <h1 className="text-2xl font-bold text-navy mb-1">Privacy Policy</h1>
        <p className="text-xs text-muted">Last updated: October 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-navy">1. Who we are</h2>
        <p>Akshatha Dental Clinic (&quot;we&quot;, &quot;our&quot;) is a specialist prosthodontic clinic located at {site.address}. We operate the website at {site.url}.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-navy">2. Information we collect</h2>
        <p>We collect information you provide when you:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Submit a contact or appointment booking form (name, phone number, email, and your query)</li>
          <li>Send us a message via WhatsApp or call us directly</li>
        </ul>
        <p>We also collect standard web analytics data (pages visited, browser type, approximate location) via Google Analytics to understand how our website is used. This data is anonymised and does not identify you personally.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-navy">3. How we use your information</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>To respond to your appointment requests and enquiries</li>
          <li>To provide and improve our dental services</li>
          <li>To send appointment reminders (only if you have booked with us)</li>
          <li>To improve our website based on analytics</li>
        </ul>
        <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-navy">4. Google OAuth & Search Console</h2>
        <p>Our clinic management system uses Google OAuth to access Google Search Console data for internal analytics purposes only. We access only search performance data (clicks, impressions, queries) for our own website and do not collect or store any Google account data belonging to patients.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-navy">5. Data security</h2>
        <p>We take reasonable steps to protect your personal information from unauthorised access, use, or disclosure. Our website is served over HTTPS and our patient management system uses encrypted storage.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-navy">6. Your rights</h2>
        <p>You may request access to, correction of, or deletion of any personal information we hold about you by contacting us at <a href={`mailto:${site.email}`} className="text-blue underline">{site.email}</a> or calling <a href={`tel:${site.phone}`} className="text-blue underline">{site.phoneDisplay}</a>.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-navy">7. Contact us</h2>
        <p>If you have any questions about this privacy policy, please contact us at:</p>
        <address className="not-italic space-y-1">
          <p className="font-semibold text-navy">Akshatha Dental Clinic</p>
          <p>{site.address}</p>
          <p>Email: <a href={`mailto:${site.email}`} className="text-blue underline">{site.email}</a></p>
          <p>Phone: <a href={`tel:${site.phone}`} className="text-blue underline">{site.phoneDisplay}</a></p>
        </address>
      </section>
    </main>
  );
}
