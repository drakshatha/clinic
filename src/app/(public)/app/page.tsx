import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download Patient App",
  description: `Download the Akshatha Dental Clinic patient app for Android. Book appointments, call, WhatsApp and get directions — all in one place.`,
  alternates: { canonical: `/app` },
};

export default function AppDownloadPage() {
  return (
    <main className="min-h-screen bg-bg-soft pt-28 pb-16">
      <div className="mx-auto w-[min(480px,calc(100%-2rem))]">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 h-24 w-24 rounded-3xl bg-blue flex items-center justify-center shadow-lg">
            <span className="text-4xl">🦷</span>
          </div>
          <h1 className="text-3xl font-bold text-navy mb-3">Akshatha Dental App</h1>
          <p className="text-muted text-base leading-relaxed">
            Book appointments, call the clinic, get directions, and learn about our services — all in one place.
          </p>
        </div>

        {/* Android Download */}
        <div className="rounded-3xl bg-white border border-line shadow-sm p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🤖</span>
            <div>
              <p className="font-bold text-navy text-base">Android App</p>
              <p className="text-sm text-muted">APK · Version 2.2</p>
            </div>
          </div>
          <a
            href="https://expo.dev/accounts/drakshatha/projects/akshatha-dental/builds/32a96ddb-ab4e-4312-8273-d4abaf7ecb78"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-blue px-6 py-3.5 text-white font-bold text-base hover:bg-blue/90 transition-colors"
          >
            <span>⬇</span> Download for Android
          </a>
          <p className="text-xs text-muted text-center mt-3">
            Opens the download page. Tap &ldquo;Install&rdquo; and allow installation from unknown sources when prompted.
          </p>
        </div>

        {/* iOS coming soon */}
        <div className="rounded-3xl bg-white border border-line shadow-sm p-6 mb-8 opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🍎</span>
            <div>
              <p className="font-bold text-navy text-base">iPhone App</p>
              <p className="text-sm text-muted">Coming soon on App Store</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 w-full rounded-full bg-navy/10 px-6 py-3.5 text-navy/50 font-bold text-base cursor-not-allowed">
            Coming Soon
          </div>
        </div>

        {/* Features */}
        <div className="rounded-3xl bg-blue/5 border border-blue/10 p-6 mb-6">
          <p className="font-bold text-navy mb-4">What&apos;s in the app</p>
          <ul className="space-y-3">
            {[
              ["📅", "View upcoming appointments"],
              ["📋", "Full visit history & treatment records"],
              ["💊", "See your treatment plan & phases"],
              ["📞", "One-tap call & WhatsApp"],
              ["🔒", "Secure login with phone OTP"],
              ["🏥", "Save your medical history"],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-sm text-navy">
                <span className="text-base">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link href="/" className="text-sm font-semibold text-blue hover:underline">
            ← Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
