import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Simple header */}
      <header className="border-b border-line bg-white px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt={site.shortName} width={36} height={36} className="h-9 w-auto" />
          <span className="text-sm font-bold text-navy hidden sm:block">{site.name}</span>
        </Link>
        <span className="text-xs font-semibold text-muted bg-blue/10 text-blue rounded-full px-3 py-1">
          Patient Portal
        </span>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
      <footer className="text-center py-4 text-xs text-muted border-t border-line">
        {site.name} · <a href={`tel:${site.phone}`} className="hover:text-navy">{site.phoneDisplay}</a>
      </footer>
    </div>
  );
}
