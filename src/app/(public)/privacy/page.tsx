import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Akshatha Dental Clinic",
  description: "Privacy policy for Akshatha Dental Clinic, Mahalakshmi Layout, Bengaluru — covering website, patient portal and mobile apps.",
  alternates: { canonical: "/privacy" },
};

const EFFECTIVE_DATE = "1 November 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-[min(760px,calc(100%-2rem))] py-20 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-navy">Privacy Policy</h1>
        <p className="text-sm text-muted">Effective date: {EFFECTIVE_DATE}</p>
        <p className="text-sm text-muted leading-relaxed">
          This policy explains how Akshatha Dental Clinic (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects,
          uses, stores, and protects your personal information when you use our website,
          patient portal, or mobile applications.
        </p>
      </div>

      <Hr />

      {/* 1 */}
      <Section title="1. Who we are">
        <p>
          Akshatha Dental Clinic is a specialist prosthodontic clinic operated by Dr. Akshatha V
          (MDS Prosthodontist &amp; Implantologist), located at {site.address}.
        </p>
        <p>
          We operate the website <strong>{site.url}</strong>, the <strong>Akshatha Dental</strong> patient
          mobile app (<code>in.drakshatha.patient</code>), and the <strong>Akshatha Clinic Staff</strong> app
          (<code>in.drakshatha.staff</code>). All are covered by this policy.
        </p>
        <p>
          For any privacy-related questions, contact us at{" "}
          <a href={`mailto:${site.email}`} className="text-blue underline">{site.email}</a> or{" "}
          <a href={`tel:${site.phone}`} className="text-blue underline">{site.phoneDisplay}</a>.
        </p>
      </Section>

      {/* 2 */}
      <Section title="2. Information we collect">
        <SubHead>2a. Website visitors</SubHead>
        <ul className="list-disc ml-5 space-y-1">
          <li>Contact/booking form submissions: name, phone number, email, and message</li>
          <li>Google Analytics: page views, session duration, approximate city-level location, device type. All data is anonymised — we cannot identify you personally from it.</li>
        </ul>

        <SubHead>2b. Patient portal &amp; mobile app</SubHead>
        <ul className="list-disc ml-5 space-y-1">
          <li><strong>Phone number</strong> — used to verify your identity via OTP and link your records</li>
          <li><strong>Appointment history</strong> — dates, treatment types, doctor notes</li>
          <li><strong>Medical / health information</strong> — blood group, allergies, existing conditions, current medications, dental concerns, pregnancy status (if applicable), and emergency contact — provided voluntarily through the health form</li>
          <li><strong>Treatment plans and lab work</strong> — uploaded by clinic staff, visible to the registered patient only</li>
          <li><strong>Feedback and reviews</strong> — if you submit a rating or comment through the app</li>
        </ul>
        <p className="text-sm text-muted">
          We do <strong>not</strong> collect payment card details, national ID numbers, biometric data, or precise GPS location.
        </p>

        <SubHead>2c. Staff app</SubHead>
        <p>
          The staff app collects staff usernames and credentials to authenticate clinic personnel.
          It accesses patient records solely to provide clinical care and clinic management functions.
          Staff credentials are never shared outside the clinic.
        </p>
      </Section>

      {/* 3 */}
      <Section title="3. How we use your information">
        <ul className="list-disc ml-5 space-y-1">
          <li>To confirm and manage appointment bookings</li>
          <li>To send OTP verification codes via SMS</li>
          <li>To provide you with access to your treatment plans, lab reports, and health records through the patient app</li>
          <li>To send appointment reminders and follow-up messages (WhatsApp or SMS)</li>
          <li>To improve our website, app features, and clinical workflows</li>
          <li>To maintain internal analytics via Google Search Console (search performance data for our own website only)</li>
        </ul>
        <p>
          We do <strong>not</strong> sell, rent, or share your personal information with third parties
          for advertising or marketing purposes.
        </p>
      </Section>

      {/* 4 */}
      <Section title="4. Health data">
        <p>
          Health and medical information you provide is used <strong>only</strong> to support your dental
          care at this clinic. It is:
        </p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Stored in an encrypted database accessible only to authorised clinic staff</li>
          <li>Never shared with insurance companies, employers, or any third party without your explicit written consent</li>
          <li>Never used for advertising or profiling</li>
        </ul>
        <p>
          Providing health information is <strong>voluntary</strong>. You may skip the health form and
          still use the appointment booking features.
        </p>
      </Section>

      {/* 5 */}
      <Section title="5. Third-party services">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-2 font-semibold text-navy">Service</th>
              <th className="text-left py-2 font-semibold text-navy">Purpose</th>
              <th className="text-left py-2 font-semibold text-navy">Data shared</th>
            </tr>
          </thead>
          <tbody className="text-muted divide-y divide-line/50">
            <tr><td className="py-2">Google Analytics</td><td className="py-2">Website usage analytics</td><td className="py-2">Anonymised browsing data</td></tr>
            <tr><td className="py-2">Twilio / SMS provider</td><td className="py-2">OTP delivery</td><td className="py-2">Phone number only</td></tr>
            <tr><td className="py-2">Vercel</td><td className="py-2">Website &amp; API hosting</td><td className="py-2">Encrypted request logs</td></tr>
            <tr><td className="py-2">Google Search Console</td><td className="py-2">Internal SEO analytics</td><td className="py-2">None — read-only access to our own site data</td></tr>
            <tr><td className="py-2">Expo / EAS</td><td className="py-2">Mobile app delivery</td><td className="py-2">None</td></tr>
          </tbody>
        </table>
        <p className="text-sm text-muted">
          No patient health data is shared with any of the services listed above.
        </p>
      </Section>

      {/* 6 */}
      <Section title="6. Data retention">
        <ul className="list-disc ml-5 space-y-1">
          <li><strong>Appointment &amp; clinical records</strong> — retained for a minimum of 7 years as required under Indian medical record-keeping guidelines</li>
          <li><strong>Health form data</strong> — retained for the duration of your patient relationship and deleted within 90 days of a deletion request</li>
          <li><strong>Contact form submissions</strong> — retained for 12 months then deleted</li>
          <li><strong>OTP codes</strong> — expire within 10 minutes and are not stored after use</li>
          <li><strong>Analytics data</strong> — retained per Google Analytics default (14 months), anonymised</li>
        </ul>
      </Section>

      {/* 7 */}
      <Section title="7. Data security">
        <ul className="list-disc ml-5 space-y-1">
          <li>All data is transmitted over HTTPS / TLS 1.2+</li>
          <li>Patient records are stored in an encrypted database with access restricted to authenticated staff</li>
          <li>Mobile app sessions use signed JWT tokens with a 7-day expiry</li>
          <li>OTP codes are single-use and expire in 10 minutes</li>
          <li>We perform regular security reviews of our systems</li>
        </ul>
      </Section>

      {/* 8 */}
      <Section title="8. Your rights">
        <p>You have the right to:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
          <li><strong>Correct</strong> — ask us to correct inaccurate data</li>
          <li><strong>Delete</strong> — request deletion of your data (subject to our legal retention obligations)</li>
          <li><strong>Withdraw consent</strong> — opt out of appointment reminders at any time</li>
          <li><strong>Data portability</strong> — request your records in a machine-readable format</li>
        </ul>
        <p>
          To exercise any of these rights, email{" "}
          <a href={`mailto:${site.email}`} className="text-blue underline">{site.email}</a> with your
          registered phone number. We will respond within 30 days.
        </p>
      </Section>

      {/* 9 */}
      <Section title="9. Children's privacy">
        <p>
          Our services are not directed to children under the age of 13. We do not knowingly collect
          personal information from children under 13 without verifiable parental consent.
          If you believe a child has provided us with personal information, please contact us and
          we will delete it promptly.
        </p>
      </Section>

      {/* 10 */}
      <Section title="10. Cookies">
        <p>
          Our website uses essential cookies for session management and Google Analytics cookies for
          anonymised usage statistics. We do not use advertising or tracking cookies. You can
          disable cookies in your browser settings; this will not affect your ability to book
          appointments or access the patient portal.
        </p>
      </Section>

      {/* 11 */}
      <Section title="11. Changes to this policy">
        <p>
          We may update this privacy policy from time to time. When we do, we will update the
          effective date at the top of this page. Continued use of our website or apps after
          changes are posted constitutes acceptance of the revised policy.
        </p>
      </Section>

      {/* 12 */}
      <Section title="12. Contact us">
        <address className="not-italic space-y-1 text-sm">
          <p className="font-semibold text-navy">Akshatha Dental Clinic</p>
          <p>{site.address}</p>
          <p>Email: <a href={`mailto:${site.email}`} className="text-blue underline">{site.email}</a></p>
          <p>Phone: <a href={`tel:${site.phone}`} className="text-blue underline">{site.phoneDisplay}</a></p>
        </address>
      </Section>
    </main>
  );
}

function Hr() {
  return <hr className="border-line" />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 text-sm leading-relaxed text-muted">
      <h2 className="text-base font-bold text-navy">{title}</h2>
      {children}
    </section>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-navy mt-4">{children}</h3>;
}
