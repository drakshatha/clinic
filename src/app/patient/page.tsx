"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "phone" | "otp";

export default function PatientLoginPage() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>("phone");
  const [phone,   setPhone]   = useState("");
  const [otp,     setOtp]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setDevCode(data.devCode ?? null); // shown in dev/unconfigured mode
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  }

  async function verifyAndLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true); setError("");
    try {
      // First verify OTP
      const vRes  = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: otp.trim() }),
      });
      const vData = await vRes.json();
      if (!vRes.ok) throw new Error(vData.error || "Invalid OTP");

      // Then create patient session
      const lRes  = await fetch("/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const lData = await lRes.json();
      if (!lRes.ok) throw new Error(lData.error || "Login failed");

      router.push("/patient/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-line bg-white p-7 shadow-[var(--shadow)]">
          {/* Icon */}
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue/10 text-2xl">
            🦷
          </div>

          {step === "phone" ? (
            <>
              <h1 className="text-xl font-bold text-navy">Patient Login</h1>
              <p className="mt-1 text-sm text-muted">Enter your mobile number to receive an OTP</p>

              <form onSubmit={sendOtp} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-navy">Mobile Number</label>
                  <div className="mt-1.5 flex gap-2">
                    <span className="flex items-center rounded-xl border border-line bg-bg px-3 text-sm text-muted">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="98765 43210"
                      className="flex-1 rounded-xl border border-line px-3 py-2.5 text-sm text-navy outline-none focus:border-blue"
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="w-full rounded-full bg-blue py-3 text-sm font-bold text-white hover:bg-blue-deep disabled:opacity-50 transition-colors"
                >
                  {loading ? "Sending OTP…" : "Send OTP"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-navy">Enter OTP</h1>
              <p className="mt-1 text-sm text-muted">
                Sent to <span className="font-semibold text-navy">+91 {phone}</span>
              </p>

              {devCode && (
                <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                  <p className="text-xs font-bold text-amber-800">Dev Mode — OTP not sent via SMS</p>
                  <p className="text-2xl font-bold text-amber-900 tracking-widest mt-1">{devCode}</p>
                </div>
              )}

              <form onSubmit={verifyAndLogin} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-navy">6-digit OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="mt-1.5 w-full rounded-xl border border-line px-3 py-3 text-center text-xl font-bold tracking-[0.4em] text-navy outline-none focus:border-blue"
                  />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full rounded-full bg-blue py-3 text-sm font-bold text-white hover:bg-blue-deep disabled:opacity-50 transition-colors"
                >
                  {loading ? "Verifying…" : "Login →"}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep("phone"); setOtp(""); setError(""); setDevCode(null); }}
                  className="w-full text-xs text-muted hover:text-navy transition-colors"
                >
                  ← Change number
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          New patient?{" "}
          <Link href="/contact#book" className="font-semibold text-blue hover:underline">
            Book an appointment
          </Link>
        </p>
      </div>
    </div>
  );
}
