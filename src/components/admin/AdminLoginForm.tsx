"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fd.get("username"),
          password: fd.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-[var(--shadow)]"
    >
      <h1 className="text-2xl font-bold text-navy">Clinic Admin Login</h1>
      <p className="mt-2 text-sm text-muted">Doctor or Assistant access</p>

      <label className="mt-6 grid gap-1.5 text-sm font-semibold text-navy">
        Username
        <input
          name="username"
          required
          autoComplete="username"
          className="rounded-xl border border-line px-3 py-3 font-medium outline-none focus:border-blue"
          placeholder="doctor or assistant"
        />
      </label>
      <label className="mt-4 grid gap-1.5 text-sm font-semibold text-navy">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-xl border border-line px-3 py-3 font-medium outline-none focus:border-blue"
        />
      </label>

      <Button type="submit" className="mt-6 w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="mt-5 rounded-xl bg-bg-soft p-3 text-xs text-muted">
        <p>
          <strong>Doctor:</strong> doctor / doctor2026
        </p>
        <p className="mt-1">
          <strong>Assistant:</strong> assistant / assist2026
        </p>
      </div>
    </form>
  );
}
