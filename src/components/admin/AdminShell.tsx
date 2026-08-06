"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Permission } from "@/lib/permissions";

type Props = {
  user: { name: string; role: string; permissions: Permission[] };
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "📋 Leads",    permission: "view_leads"   as Permission },
  { href: "/admin/calendar",  label: "📅 Calendar", permission: "view_calendar" as Permission },
  { href: "/admin/staff",     label: "👤 Staff",    permission: "manage_staff"  as Permission },
];

export function AdminShell({ user, children }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const links = NAV_ITEMS.filter((n) => user.permissions.includes(n.permission));

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {links.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              active ? "bg-blue text-white" : "text-navy hover:bg-bg-soft"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const UserBadge = () => (
    <div className="mb-6 px-2">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">Clinic Admin</p>
      <p className="mt-1 text-sm font-semibold text-navy truncate">{user.name}</p>
      <span className="mt-1 inline-block rounded-full bg-blue/10 px-2 py-0.5 text-[11px] font-bold text-blue">
        {user.role}
      </span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-bg">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col border-r border-line bg-white px-4 py-6">
        <UserBadge />
        <NavLinks />
        <button
          onClick={logout}
          disabled={loggingOut}
          className="mt-auto rounded-xl px-4 py-3 text-left text-sm font-semibold text-muted hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50"
        >
          {loggingOut ? "Logging out…" : "🚪 Log out"}
        </button>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 md:hidden">
        <span className="text-sm font-bold text-navy">{user.name}</span>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-navy hover:bg-bg-soft"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex w-56 flex-col bg-white px-4 py-6 pt-16">
            <UserBadge />
            <NavLinks />
            <button
              onClick={logout}
              disabled={loggingOut}
              className="mt-auto rounded-xl px-4 py-3 text-left text-sm font-semibold text-muted hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              {loggingOut ? "Logging out…" : "🚪 Log out"}
            </button>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto px-4 py-6 pt-20 md:pt-6">
        {children}
      </main>
    </div>
  );
}
