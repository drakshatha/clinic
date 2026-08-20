"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function EditShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/edit/logout", { method: "POST" });
    router.push("/edit/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          {/* Tooth icon */}
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#EA6C1A]">
            <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
              <path
                d="M16 3.5C13 3.5 10.5 4.5 9.5 6.5C8.5 8 8.5 10 9 12.5C9.5 15 10 16.5 10 18.5
                  C10 20.5 9.5 23 10 25.5C10.5 27.5 12 28.5 13.5 27C14.5 25.5 15 23.5 16 23.5
                  C17 23.5 17.5 25.5 18.5 27C20 28.5 21.5 27.5 22 25.5C22.5 23 22 20.5 22 18.5
                  C22 16.5 22.5 15 23 12.5C23.5 10 23.5 8 22.5 6.5C21.5 4.5 19 3.5 16 3.5Z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-navy leading-none">Site Editor</p>
            <p className="text-[11px] text-muted leading-none mt-0.5">Dr. Akshatha&apos;s Clinic</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-muted hover:text-navy hover:border-navy transition"
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden>
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
            View site
          </a>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-muted hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
