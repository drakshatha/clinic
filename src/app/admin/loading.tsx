/**
 * Admin loading skeleton — shown INSTANTLY by Next.js on every admin
 * navigation while the server component and its DB queries run.
 *
 * The user sees the sidebar + animated content area in <50ms instead of
 * a frozen blank page for 2–3 seconds.
 */
export default function AdminLoading() {
  return (
    <div className="mx-auto w-[min(1100px,100%)] space-y-4 pt-2">
      {/* Page title placeholder */}
      <div className="h-6 w-40 rounded-xl bg-line animate-pulse" />

      {/* Stat card row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl border border-line bg-white animate-pulse" />
        ))}
      </div>

      {/* Main content block */}
      <div className="h-64 rounded-2xl border border-line bg-white animate-pulse" />

      {/* Two-column row */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-48 rounded-2xl border border-line bg-white animate-pulse" />
        <div className="h-48 rounded-2xl border border-line bg-white animate-pulse" />
      </div>
    </div>
  );
}
