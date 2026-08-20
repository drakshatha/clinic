"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/edit/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password. Try again.");
        return;
      }
      router.push("/edit");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#f0f6fb_0%,#fafcff_60%,#fff_100%)] px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#EA6C1A] shadow-[0_4px_16px_rgba(234,108,26,0.35)]">
            {/* Tooth icon */}
            <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden>
              <path
                d="M16 3.5C13 3.5 10.5 4.5 9.5 6.5C8.5 8 8.5 10 9 12.5C9.5 15 10 16.5 10 18.5
                  C10 20.5 9.5 23 10 25.5C10.5 27.5 12 28.5 13.5 27C14.5 25.5 15 23.5 16 23.5
                  C17 23.5 17.5 25.5 18.5 27C20 28.5 21.5 27.5 22 25.5C22.5 23 22 20.5 22 18.5
                  C22 16.5 22.5 15 23 12.5C23.5 10 23.5 8 22.5 6.5C21.5 4.5 19 3.5 16 3.5Z"
                fill="white"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-navy">Dr. Akshatha's Clinic</h1>
          <p className="mt-1 text-sm text-muted">Site Content Editor</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-line bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
          <h2 className="mb-1 text-lg font-bold text-navy">Sign in</h2>
          <p className="mb-6 text-sm text-muted">
            Edit service pages, FAQs, and clinic stats.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-navy">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="Enter site editor password"
                className="rounded-xl border border-line px-4 py-3 text-base outline-none focus:border-blue focus:ring-2 focus:ring-blue/10"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-full bg-blue py-3 text-sm font-bold text-white transition hover:bg-blue-deep disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Looking for the clinic admin panel?{" "}
          <a href="/admin" className="font-semibold text-blue hover:underline">
            Go to Admin
          </a>
        </p>
      </div>
    </div>
  );
}
