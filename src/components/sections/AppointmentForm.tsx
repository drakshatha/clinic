"use client";

import { FormEvent, useEffect, useState } from "react";
import { services, site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { todayIst } from "@/lib/client-time";

type Status = "idle" | "loading" | "success" | "error";
type Slot = { time: string; available: boolean };

export function AppointmentForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [slotDate, setSlotDate] = useState(todayIst());
  const [slotTime, setSlotTime] = useState("");
  const [dob, setDob]       = useState("");
  const [gender, setGender] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setSlotTime("");
      try {
        const res = await fetch(`/api/slots?date=${encodeURIComponent(slotDate)}`);
        const data = await res.json();
        if (!cancelled) setSlots(data.open || []);
      } catch {
        if (!cancelled) setSlots([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slotDate]);

  async function sendOtp() {
    setMessage("");
    if (!phone.trim()) {
      setStatus("error");
      setMessage("Enter phone number first.");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
      setOtpVerified(false);
      setDevCode(data.devCode || null);
      setStatus("idle");
      setMessage(data.devCode ? `Dev OTP: ${data.devCode}` : "OTP sent to your phone.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setOtpLoading(false);
    }
  }

  async function verifyOtp() {
    setMessage("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      setOtpVerified(true);
      setStatus("idle");
      setMessage("Phone verified. You can submit the booking.");
    } catch (err) {
      setOtpVerified(false);
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "OTP verification failed");
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      phone: phone.trim(),
      email: String(data.get("email") || "").trim(),
      treatment: String(data.get("treatment") || "").trim(),
      message: String(data.get("message") || "").trim(),
      slot_date: slotDate,
      slot_time: slotTime,
      otp: otp.trim(),
      source: "website",
      dob: dob || undefined,
      gender: gender || undefined,
    };

    if (!payload.name || !payload.phone || !payload.slot_date || !payload.slot_time) {
      setStatus("error");
      setMessage("Name, phone, date and time slot are required.");
      return;
    }
    if (!otpVerified && !payload.otp) {
      setStatus("error");
      setMessage("Please verify OTP before submitting.");
      return;
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");

      setStatus("success");
      setMessage(json.message || "Thank you! Our team will contact you shortly.");
      form.reset();
      setPhone("");
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setDevCode(null);
      setSlotTime("");
      setDob("");
      setGender("");

      if (json.whatsappUrl) {
        window.open(json.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not submit. Please call us.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow)] md:p-8"
      noValidate
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
          Limited appointments available
        </p>
        <h3 className="mt-2 text-2xl font-bold text-navy">Book Appointment</h3>
        <p className="mt-2 text-sm text-muted">
          Pick an open slot (IST), verify phone with OTP, then submit. Hours: {site.hours}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold text-navy">
          Full name *
          <input
            name="name"
            required
            autoComplete="name"
            className="rounded-xl border border-line px-3 py-3 text-base font-medium outline-none transition focus:border-blue"
            placeholder="Your name"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-navy">
          Phone *
          <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setOtpSent(false);
              setOtpVerified(false);
            }}
            required
            autoComplete="tel"
            inputMode="tel"
            className="rounded-xl border border-line px-3 py-3 text-base font-medium outline-none transition focus:border-blue"
            placeholder="+91 98765 43210"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-navy">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="rounded-xl border border-line px-3 py-3 text-base font-medium outline-none transition focus:border-blue"
            placeholder="you@email.com"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-navy">
          Date of Birth
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            max={todayIst()}
            className="rounded-xl border border-line px-3 py-3 text-base font-medium outline-none transition focus:border-blue"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-navy">
          Gender
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="rounded-xl border border-line px-3 py-3 text-base font-medium outline-none transition focus:border-blue"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-navy">
          Treatment interest
          <select
            name="treatment"
            className="rounded-xl border border-line px-3 py-3 text-base font-medium outline-none transition focus:border-blue"
            defaultValue=""
          >
            <option value="">General consultation</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-navy">
          Preferred date (IST) *
          <input
            type="date"
            required
            min={todayIst()}
            value={slotDate}
            onChange={(e) => setSlotDate(e.target.value)}
            className="rounded-xl border border-line px-3 py-3 text-base font-medium outline-none transition focus:border-blue"
          />
        </label>

        <div className="grid gap-1.5 text-sm font-semibold text-navy">
          Available time slots *
          <div className="grid max-h-36 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-line p-2">
            {slots.length === 0 ? (
              <p className="col-span-3 p-2 text-xs font-medium text-muted">
                No open slots this day — try another date.
              </p>
            ) : (
              slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  onClick={() => setSlotTime(s.time)}
                  className={`rounded-lg border px-2 py-2 text-xs font-bold transition ${
                    slotTime === s.time
                      ? "border-blue bg-blue/10 text-blue-deep"
                      : "border-line bg-white text-navy hover:border-blue"
                  }`}
                >
                  {s.time}
                </button>
              ))
            )}
          </div>
        </div>

        <label className="grid gap-1.5 text-sm font-semibold text-navy md:col-span-2">
          Message
          <textarea
            name="message"
            rows={3}
            className="resize-y rounded-xl border border-line px-3 py-3 text-base font-medium outline-none transition focus:border-blue"
            placeholder="Tell us about your concern (optional)"
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-bg-soft p-4">
        <p className="mb-3 text-sm font-bold text-navy">Phone verification (OTP) *</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button type="button" variant="secondary" onClick={sendOtp} disabled={otpLoading}>
            {otpLoading ? "Sending…" : otpSent ? "Resend OTP" : "Send OTP"}
          </Button>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="w-full rounded-full border border-line px-4 py-3 text-base font-semibold outline-none focus:border-blue sm:w-auto sm:min-w-[140px] sm:flex-1"
          />
          <Button type="button" variant="secondary" onClick={verifyOtp} disabled={!otpSent}>
            Verify
          </Button>
        </div>
        {otpVerified ? (
          <p className="mt-2 text-sm font-medium text-success">Phone verified ✔</p>
        ) : null}
        {devCode ? (
          <p className="mt-2 text-xs text-muted">Local testing OTP: <strong>{devCode}</strong></p>
        ) : null}
      </div>

      <div className="mt-5">
        <Button
          type="submit"
          className="w-full"
          disabled={status === "loading" || !slotTime || !otpVerified}
        >
          {status === "loading" ? "Submitting…" : "Submit Appointment Request"}
        </Button>
      </div>

      {status === "success" ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-success">
          {message}
        </p>
      ) : null}
      {status === "error" || (message && status === "idle" && (otpSent || otpVerified)) ? (
        status === "error" ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </p>
        ) : message ? (
          <p className="mt-4 rounded-xl bg-blue/10 px-4 py-3 text-sm font-medium text-blue-deep">
            {message}
          </p>
        ) : null
      ) : null}
    </form>
  );
}
