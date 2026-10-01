import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";

export const metadata = {
  title: "Tech Stack Reference – Admin",
  robots: { index: false, follow: false },
};

type Service = {
  name: string;
  url: string;
  dashboard?: string;
  docs?: string;
  role: string;
  note?: string;
};

type Section = {
  title: string;
  icon: string;
  items: Service[];
};

const sections: Section[] = [
  {
    title: "Hosting & Deployment",
    icon: "☁️",
    items: [
      {
        name: "Vercel",
        url: "https://vercel.com",
        dashboard: "https://vercel.com/dashboard",
        docs: "https://vercel.com/docs",
        role: "Production hosting. Auto-deploys on every git push to main. Manages the drakshatha.in domain.",
      },
      {
        name: "GitHub",
        url: "https://github.com",
        dashboard: "https://github.com/drakshatha/clinic",
        role: "Source code repository. Every push to main triggers a Vercel deployment.",
        note: "Repo: drakshatha/clinic",
      },
    ],
  },
  {
    title: "Database",
    icon: "🗄️",
    items: [
      {
        name: "Neon (PostgreSQL)",
        url: "https://neon.tech",
        dashboard: "https://console.neon.tech",
        docs: "https://neon.tech/docs",
        role: "Serverless Postgres (Singapore region). All patient data, appointments, treatment plans, settings.",
        note: "Auto-suspends ~5 min after last query. UptimeRobot warm-db ping keeps it alive.",
      },
      {
        name: "Prisma ORM",
        url: "https://www.prisma.io",
        docs: "https://www.prisma.io/docs",
        role: "Database client and migration tool. Schema: prisma/schema.prisma. Use `npx prisma studio` to browse data locally.",
      },
    ],
  },
  {
    title: "File Storage",
    icon: "📁",
    items: [
      {
        name: "Vercel Blob",
        url: "https://vercel.com/docs/storage/vercel-blob",
        dashboard: "https://vercel.com/dashboard",
        docs: "https://vercel.com/docs/storage/vercel-blob",
        role: "Cloud storage for patient files — X-rays, consent forms, lab work, lead documents.",
        note: "View stored files: Vercel Dashboard → Storage → Blob.",
      },
    ],
  },
  {
    title: "Patient Messaging",
    icon: "💬",
    items: [
      {
        name: "WhatsApp Business API (Meta)",
        url: "https://business.whatsapp.com",
        dashboard: "https://business.facebook.com",
        docs: "https://developers.facebook.com/docs/whatsapp/cloud-api",
        role: "Appointment confirmations, 24h & 1h reminders, treatment plans, payment reminders, recalls, birthdays.",
        note: "Manage at Meta Business Suite → WhatsApp Manager. Uses Cloud API v19.0.",
      },
      {
        name: "MSG91",
        url: "https://msg91.com",
        dashboard: "https://control.msg91.com",
        docs: "https://docs.msg91.com",
        role: "Primary SMS provider for patient OTP login.",
        note: "If MSG91 fails → system falls back to Twilio → then WhatsApp automatically.",
      },
      {
        name: "Twilio",
        url: "https://www.twilio.com",
        dashboard: "https://console.twilio.com",
        docs: "https://www.twilio.com/docs",
        role: "Fallback SMS OTP provider when MSG91 is unavailable.",
      },
    ],
  },
  {
    title: "Google Services",
    icon: "🔍",
    items: [
      {
        name: "Google Places API",
        url: "https://developers.google.com/maps/documentation/places",
        dashboard: "https://console.cloud.google.com",
        docs: "https://developers.google.com/maps/documentation/places/web-service/details",
        role: "Fetches live star rating and review count from Google Business Profile every 6 hours.",
        note: "Configure via Google Cloud Console. If not set, falls back to Admin → Settings values.",
      },
      {
        name: "Google Business Profile",
        url: "https://business.google.com",
        dashboard: "https://business.google.com",
        role: "Clinic's Google listing. Manage reviews, photos, hours here.",
        note: "Most important for local patient discovery. Patient review link: https://g.page/r/CcptNvhnF_qkEBE/review",
      },
      {
        name: "Google Search Console",
        url: "https://search.google.com/search-console",
        dashboard: "https://search.google.com/search-console",
        role: "Monitor search rankings, indexation, Core Web Vitals. Submit sitemap here.",
        note: "Sitemap: https://drakshatha.in/sitemap.xml — submit once and Google auto-recrawls.",
      },
    ],
  },
  {
    title: "Monitoring",
    icon: "📡",
    items: [
      {
        name: "UptimeRobot",
        url: "https://uptimerobot.com",
        dashboard: "https://dashboard.uptimerobot.com",
        role: "Pings the DB warm endpoint every 5 min. Prevents Neon cold-starts. Also monitors overall site uptime.",
        note: "If monitor shows DOWN for >10 min, admin panel first load will be slow (Neon cold start). Check dashboard and re-save the monitor if needed.",
      },
    ],
  },
  {
    title: "Framework & Language",
    icon: "⚡",
    items: [
      {
        name: "Next.js 16",
        url: "https://nextjs.org",
        docs: "https://nextjs.org/docs",
        role: "Full-stack React framework — SSR, API routes, ISR, App Router, streaming, loading skeletons.",
        note: "Version is newer than most AI training data. For accurate API: check node_modules/next/dist/docs/ or nextjs.org/docs.",
      },
      {
        name: "React 19",
        url: "https://react.dev",
        docs: "https://react.dev/reference",
        role: "UI library. Server Components for SSR. Client Components (use client) for interactive admin UI.",
      },
      {
        name: "TypeScript",
        url: "https://www.typescriptlang.org",
        docs: "https://www.typescriptlang.org/docs",
        role: "Type-safe JavaScript across all code — frontend, API routes, DB queries.",
      },
      {
        name: "Tailwind CSS v4",
        url: "https://tailwindcss.com",
        docs: "https://tailwindcss.com/docs",
        role: "Utility-first CSS. All UI styling.",
        note: "v4 uses PostCSS plugin — no tailwind.config.js. Config is inside globals.css.",
      },
    ],
  },
  {
    title: "SEO",
    icon: "📈",
    items: [
      {
        name: "Schema.org",
        url: "https://schema.org",
        docs: "https://schema.org/Dentist",
        role: "JSON-LD structured data on every page: Dentist + LocalBusiness, FAQPage, BreadcrumbList, MedicalProcedure.",
        note: "Test: https://search.google.com/test/rich-results",
      },
    ],
  },
];

function Card({ item }: { item: Service }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 space-y-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <span className="text-base font-bold text-navy">{item.name}</span>
        <div className="flex items-center gap-3 flex-wrap">
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue hover:underline font-semibold">Site ↗</a>
          {item.dashboard && (
            <a href={item.dashboard} target="_blank" rel="noopener noreferrer"
              className="text-xs text-green-700 hover:underline font-semibold">Dashboard ↗</a>
          )}
          {item.docs && (
            <a href={item.docs} target="_blank" rel="noopener noreferrer"
              className="text-xs text-muted hover:underline">Docs ↗</a>
          )}
        </div>
      </div>
      <p className="text-sm text-muted leading-relaxed">{item.role}</p>
      {item.note && (
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
          <p className="text-xs text-amber-900 leading-relaxed">{item.note}</p>
        </div>
      )}
    </div>
  );
}

export default async function StackPage() {
  const session = await requireStaff("view_leads");
  if (!session) redirect("/admin");

  return (
    <div className="mx-auto w-[min(1100px,100%)] space-y-10 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-navy">Tech Stack & Services</h1>
        <p className="mt-1 text-sm text-muted">
          All services powering this platform — website, dashboard, and docs links for quick reference.
        </p>
      </div>

      {sections.map((sec) => (
        <div key={sec.title}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">{sec.icon}</span>
            <h2 className="text-base font-bold text-navy">{sec.title}</h2>
            <div className="flex-1 h-px bg-line" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {sec.items.map((item) => (
              <Card key={item.name} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
