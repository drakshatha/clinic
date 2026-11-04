import Link from "next/link";

export function AppDownloadStrip() {
  return (
    <section className="py-10 bg-bg-soft border-y border-line">
      <div className="mx-auto w-[min(1120px,calc(100%-2rem))] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-blue flex items-center justify-center shadow-md shrink-0">
            <span className="text-2xl">🦷</span>
          </div>
          <div>
            <p className="font-bold text-navy text-base">Akshatha Dental — Patient App</p>
            <p className="text-sm text-muted mt-0.5">View appointments, treatment plans &amp; records. Android · Free download.</p>
          </div>
        </div>
        <Link
          href="/app"
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white shadow hover:bg-navy/90 transition-colors"
        >
          <span>⬇</span> Download App
        </Link>
      </div>
    </section>
  );
}
