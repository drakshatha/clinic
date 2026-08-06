"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  message: string;
  slot_date: string;
  slot_time: string;
  slot_label: string;
  status: string;
  created_at_ist: string;
  confirmed_at_ist?: string | null;
  confirmed_by?: string;
  whatsapp_confirm_sent?: boolean;
};

export function LeadsTable() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/leads");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = await res.json();
    setLeads(data.leads || []);
    setUser(data.user || null);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function confirmLead(id: string) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}/confirm`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Confirm failed");

      // If WhatsApp API not configured, open wa.me to patient
      if (data.whatsapp?.mode === "wa_me_link" && data.whatsapp?.patientConfirmUrl) {
        window.open(data.whatsapp.patientConfirmUrl, "_blank", "noopener,noreferrer");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirm failed");
    } finally {
      setBusyId(null);
    }
  }

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Leads & Appointments</h1>
          {user ? (
            <p className="text-sm text-muted">
              Signed in as {user.name} · {user.role}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => load()}>
            Refresh
          </Button>
          <Button type="button" variant="secondary" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-[var(--shadow-sm)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg-soft text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Submitted (IST)</th>
              <th className="px-4 py-3">Slot (IST)</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Treatment</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted">
                  No leads yet.
                </td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id} className="border-t border-line align-top">
                  <td className="px-4 py-3 whitespace-nowrap">{l.created_at_ist}</td>
                  <td className="px-4 py-3 font-semibold text-navy whitespace-nowrap">
                    {l.slot_label}
                  </td>
                  <td className="px-4 py-3 font-semibold">{l.name}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${l.phone}`} className="text-blue hover:underline">
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">{l.email || "—"}</td>
                  <td className="px-4 py-3">{l.treatment || "—"}</td>
                  <td className="px-4 py-3 max-w-[220px]">{l.message || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-bg-soft px-2 py-1 text-xs font-bold capitalize">
                      {l.status.replace("_", " ")}
                    </span>
                    {l.confirmed_by ? (
                      <p className="mt-1 text-[11px] text-muted">
                        by {l.confirmed_by}
                        {l.confirmed_at_ist ? ` · ${l.confirmed_at_ist}` : ""}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-[160px] flex-col gap-2">
                      {l.status === "pending" ? (
                        <button
                          type="button"
                          disabled={busyId === l.id}
                          onClick={() => confirmLead(l.id)}
                          className="rounded-full bg-success px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                        >
                          {busyId === l.id ? "…" : "Confirm → WhatsApp"}
                        </button>
                      ) : null}
                      {l.status === "confirmed" ? (
                        <button
                          type="button"
                          disabled={busyId === l.id}
                          onClick={() => setStatus(l.id, "completed")}
                          className="rounded-full border border-line px-3 py-2 text-xs font-bold"
                        >
                          Mark visited
                        </button>
                      ) : null}
                      {l.status !== "cancelled" ? (
                        <button
                          type="button"
                          disabled={busyId === l.id}
                          onClick={() => setStatus(l.id, "cancelled")}
                          className="rounded-full border border-red-200 px-3 py-2 text-xs font-bold text-red-700"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
