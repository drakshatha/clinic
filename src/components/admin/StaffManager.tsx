"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StaffRow = {
  id: string;
  name: string;
  username: string;
  role: string;
  createdAt: string;
};

type EditState = { id: string; name: string; role: string; password: string } | null;

export function StaffManager() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [editState, setEditState] = useState<EditState>(null);

  // New staff form
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"doctor" | "assistant">("assistant");
  const [showAdd, setShowAdd] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/staff");
    if (res.status === 403) { router.push("/admin/dashboard"); return; }
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setStaff(data.staff || []);
  }

  useEffect(() => { load().catch((e) => setError(e.message)); }, []);

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function addStaff(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, username: newUsername, password: newPassword, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setNewName(""); setNewUsername(""); setNewPassword(""); setNewRole("assistant");
      setShowAdd(false);
      flash(`✅ ${data.staff.name} added`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally { setBusy(false); }
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editState) return;
    setBusy(true);
    setError("");
    try {
      const patch: Record<string, string> = { name: editState.name, role: editState.role };
      if (editState.password) patch.password = editState.password;
      const res = await fetch(`/api/admin/staff/${editState.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setEditState(null);
      flash(`✅ ${data.staff.name} updated`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally { setBusy(false); }
  }

  async function deleteStaff(id: string, name: string) {
    if (!confirm(`Remove ${name} from staff? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      flash(`${name} removed`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally { setBusy(false); }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">Staff Management</h1>
          <p className="text-xs text-muted mt-0.5">Doctor access only · {staff.length} staff members</p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="rounded-full bg-blue px-4 py-2 text-sm font-bold text-white hover:bg-blue-deep transition-colors"
        >
          {showAdd ? "✕ Cancel" : "+ Add Staff"}
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

      {/* Add new staff form */}
      {showAdd && (
        <form onSubmit={addStaff} className="mb-6 rounded-2xl border border-blue/30 bg-blue/5 p-5">
          <h2 className="mb-4 text-sm font-bold text-navy">New Staff Account</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-semibold text-navy">
              Full Name
              <input
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Dr. Priya Sharma"
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-navy">
              Username
              <input
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                placeholder="dr_priya"
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-navy">
              Password <span className="font-normal text-muted">(min 6 chars)</span>
              <input
                required
                type="password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-navy">
              Role
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as "doctor" | "assistant")}
                className="rounded-xl border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-blue bg-white"
              >
                <option value="assistant">Assistant</option>
                <option value="doctor">Doctor</option>
              </select>
            </label>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-4 rounded-full bg-blue px-5 py-2 text-sm font-bold text-white hover:bg-blue-deep disabled:opacity-60 transition-colors"
          >
            {busy ? "Creating…" : "Create Account"}
          </button>
        </form>
      )}

      {/* Staff list */}
      <div className="flex flex-col gap-3">
        {staff.map((s) => (
          <div key={s.id} className="rounded-2xl border border-line bg-white p-4">
            {editState?.id === s.id ? (
              <form onSubmit={saveEdit} className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-navy">
                  Full Name
                  <input
                    required
                    value={editState.name}
                    onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                    className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-navy">
                  Role
                  <select
                    value={editState.role}
                    onChange={(e) => setEditState({ ...editState, role: e.target.value })}
                    className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue"
                  >
                    <option value="assistant">Assistant</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-semibold text-navy sm:col-span-2">
                  New Password <span className="font-normal text-muted">(leave blank to keep current)</span>
                  <input
                    type="password"
                    minLength={6}
                    value={editState.password}
                    onChange={(e) => setEditState({ ...editState, password: e.target.value })}
                    placeholder="••••••••"
                    className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue"
                  />
                </label>
                <div className="flex gap-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="rounded-full bg-blue px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-deep disabled:opacity-60"
                  >
                    {busy ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditState(null)}
                    className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-muted hover:bg-bg-soft"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-navy">{s.name}</p>
                  <p className="text-xs text-muted mt-0.5">@{s.username}</p>
                  <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${s.role === "doctor" ? "bg-blue/10 text-blue" : "bg-success/10 text-success"}`}>
                    {s.role}
                  </span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditState({ id: s.id, name: s.name, role: s.role, password: "" })}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-navy hover:border-blue hover:text-blue transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteStaff(s.id, s.name)}
                    disabled={busy}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {staff.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">No staff accounts yet.</p>
        )}
      </div>
    </div>
  );
}
