export default function LeadsLoading() {
  return (
    <div className="mx-auto w-[min(1100px,100%)] space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 rounded-xl bg-line animate-pulse" />
        <div className="h-9 w-48 rounded-xl bg-line animate-pulse" />
      </div>
      <div className="rounded-2xl border border-line bg-white overflow-hidden">
        {/* Table header */}
        <div className="border-b border-line px-4 py-3 flex gap-4">
          {[120, 80, 90, 70, 60].map((w, i) => (
            <div key={i} className={`h-4 rounded bg-line animate-pulse`} style={{ width: w }} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-line px-4 py-3.5 flex gap-4 items-center">
            {[120, 80, 90, 70, 60].map((w, j) => (
              <div key={j} className="h-3.5 rounded bg-line/60 animate-pulse" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
