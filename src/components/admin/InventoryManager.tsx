"use client";

import { useCallback, useEffect, useState } from "react";

type LogEntry = { id: string; change: number; note: string; createdAt: string };
type Item = {
  id: string; name: string; category: string; unit: string;
  currentStock: number; minStock: number; costPerUnit: number; notes: string;
  createdAt: string; updatedAt: string;
  logs: LogEntry[];
};

const CATEGORIES = ["anesthesia", "composites", "instruments", "ppe", "general"] as const;
const CAT_LABELS: Record<string, string> = {
  anesthesia: "💉 Anesthesia",
  composites: "🦷 Composites & Materials",
  instruments:"🔧 Instruments",
  ppe:        "🧤 PPE",
  general:    "📦 General",
};
const UNITS = ["pcs", "box", "ml", "gm", "roll", "pair", "bottle"];

const DEFAULT_ITEMS = [
  { name: "Lidocaine 2% Cartridges", category: "anesthesia", unit: "box", currentStock: 5, minStock: 2, costPerUnit: 320 },
  { name: "Disposable Syringes", category: "anesthesia", unit: "box", currentStock: 3, minStock: 2, costPerUnit: 150 },
  { name: "Composite Resin A2", category: "composites", unit: "pcs", currentStock: 4, minStock: 2, costPerUnit: 800 },
  { name: "Composite Resin A3", category: "composites", unit: "pcs", currentStock: 2, minStock: 2, costPerUnit: 800 },
  { name: "GIC Luting Cement", category: "composites", unit: "pcs", currentStock: 1, minStock: 2, costPerUnit: 650 },
  { name: "Disposable Gloves (M)", category: "ppe", unit: "box", currentStock: 8, minStock: 3, costPerUnit: 280 },
  { name: "Disposable Gloves (L)", category: "ppe", unit: "box", currentStock: 5, minStock: 3, costPerUnit: 280 },
  { name: "Face Masks (3-ply)", category: "ppe", unit: "box", currentStock: 6, minStock: 2, costPerUnit: 180 },
  { name: "Disposable Aprons", category: "ppe", unit: "pcs", currentStock: 30, minStock: 10, costPerUnit: 12 },
  { name: "Saliva Ejectors", category: "instruments", unit: "box", currentStock: 2, minStock: 1, costPerUnit: 90 },
  { name: "Cotton Rolls", category: "instruments", unit: "box", currentStock: 4, minStock: 2, costPerUnit: 60 },
  { name: "Gauze Pieces", category: "general", unit: "box", currentStock: 5, minStock: 2, costPerUnit: 80 },
];

function StockBadge({ current, min }: { current: number; min: number }) {
  if (current === 0) return <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-bold">Out of stock</span>;
  if (current <= min) return <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] font-bold">⚠️ Low</span>;
  return <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-bold">✓ OK</span>;
}

export function InventoryManager() {
  const [items, setItems]       = useState<Item[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showAdd, setShowAdd]   = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adjustId, setAdjustId] = useState<string | null>(null);
  const [adjChange, setAdjChange] = useState("");
  const [adjNote, setAdjNote]   = useState("");
  const [adjSaving, setAdjSaving] = useState(false);
  const [seeding, setSeeding]   = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");

  // Add item form
  const [newName, setNewName]   = useState("");
  const [newCat,  setNewCat]    = useState("general");
  const [newUnit, setNewUnit]   = useState("pcs");
  const [newStock, setNewStock] = useState("0");
  const [newMin,   setNewMin]   = useState("5");
  const [newCost,  setNewCost]  = useState("0");
  const [newNotes, setNewNotes] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/inventory");
    const d = await res.json();
    setItems(d.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setAddSaving(true);
    await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName, category: newCat, unit: newUnit,
        currentStock: parseInt(newStock) || 0,
        minStock: parseInt(newMin) || 5,
        costPerUnit: parseFloat(newCost) || 0,
        notes: newNotes,
      }),
    });
    setNewName(""); setNewCat("general"); setNewUnit("pcs");
    setNewStock("0"); setNewMin("5"); setNewCost("0"); setNewNotes("");
    setShowAdd(false);
    setAddSaving(false);
    await load();
  }

  async function adjust(id: string) {
    const change = parseInt(adjChange);
    if (isNaN(change) || change === 0) return;
    setAdjSaving(true);
    await fetch(`/api/admin/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ change, note: adjNote }),
    });
    setAdjustId(null); setAdjChange(""); setAdjNote("");
    setAdjSaving(false);
    await load();
  }

  async function del(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/inventory/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function seedDefaults() {
    setSeeding(true);
    for (const item of DEFAULT_ITEMS) {
      await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, notes: "" }),
      });
    }
    setSeeding(false);
    await load();
  }

  const lowCount   = items.filter((i) => i.currentStock <= i.minStock).length;
  const outCount   = items.filter((i) => i.currentStock === 0).length;
  const totalValue = items.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0);

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const list = items.filter((i) => i.category === cat && (filterCat === "all" || filterCat === cat));
    if (list.length) acc[cat] = list;
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    <div className="mx-auto w-[min(900px,100%)] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-navy">Inventory</h1>
          <p className="text-xs text-muted mt-0.5">{items.length} items · Stock value ₹{Math.round(totalValue).toLocaleString("en-IN")}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {items.length === 0 && !loading && (
            <button onClick={seedDefaults} disabled={seeding}
              className="rounded-full border border-dashed border-blue text-blue px-4 py-2 text-xs font-semibold hover:bg-blue hover:text-white transition-colors disabled:opacity-50">
              {seeding ? "Adding…" : "🌱 Seed Default Items"}
            </button>
          )}
          <button onClick={() => setShowAdd(!showAdd)}
            className="rounded-full bg-navy text-white px-4 py-2 text-xs font-bold hover:bg-navy-soft transition-colors">
            + Add Item
          </button>
        </div>
      </div>

      {/* Alert bar */}
      {(outCount > 0 || lowCount > 0) && (
        <div className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${outCount > 0 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
          <span className="text-lg">{outCount > 0 ? "🚨" : "⚠️"}</span>
          <div className="text-xs">
            {outCount > 0 && <span className="font-bold text-red-700">{outCount} item{outCount > 1 ? "s" : ""} out of stock. </span>}
            {lowCount > 0 && <span className="font-bold text-amber-700">{lowCount} item{lowCount > 1 ? "s" : ""} running low. </span>}
            <span className="text-muted">Please restock soon.</span>
          </div>
        </div>
      )}

      {/* Filter */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilterCat("all")}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors border ${filterCat === "all" ? "bg-navy text-white border-navy" : "border-line text-muted hover:border-navy hover:text-navy"}`}>
            All ({items.length})
          </button>
          {CATEGORIES.filter((c) => items.some((i) => i.category === c)).map((c) => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors border ${filterCat === c ? "bg-navy text-white border-navy" : "border-line text-muted hover:border-navy hover:text-navy"}`}>
              {CAT_LABELS[c]} ({items.filter((i) => i.category === c).length})
            </button>
          ))}
        </div>
      )}

      {/* Add item form */}
      {showAdd && (
        <form onSubmit={addItem} className="rounded-2xl border border-blue/30 bg-blue/5 p-4 space-y-3">
          <p className="text-xs font-bold text-navy">New Item</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Item name *"
              className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue" />
            <div className="flex gap-2">
              <select value={newCat} onChange={(e) => setNewCat(e.target.value)}
                className="flex-1 rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue bg-white">
                {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
              </select>
              <select value={newUnit} onChange={(e) => setNewUnit(e.target.value)}
                className="w-24 rounded-xl border border-line px-2 py-2 text-sm outline-none focus:border-blue bg-white">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <label className="flex-1 grid gap-1 text-[11px] font-semibold text-muted">
                Current Stock
                <input type="number" min="0" value={newStock} onChange={(e) => setNewStock(e.target.value)}
                  className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue" />
              </label>
              <label className="flex-1 grid gap-1 text-[11px] font-semibold text-muted">
                Min (alert)
                <input type="number" min="0" value={newMin} onChange={(e) => setNewMin(e.target.value)}
                  className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue" />
              </label>
              <label className="flex-1 grid gap-1 text-[11px] font-semibold text-muted">
                Cost/unit ₹
                <input type="number" min="0" value={newCost} onChange={(e) => setNewCost(e.target.value)}
                  className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue" />
              </label>
            </div>
            <input value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Notes (optional)"
              className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-blue" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={addSaving}
              className="rounded-full bg-navy text-white px-5 py-2 text-sm font-bold hover:bg-navy-soft disabled:opacity-50 transition-colors">
              {addSaving ? "Adding…" : "Add Item"}
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
              className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-muted hover:bg-bg-soft transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Item list */}
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1,2,3,4].map((i) => <div key={i} className="h-14 rounded-2xl bg-white border border-line" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="text-sm text-muted">No inventory items yet.</p>
          <p className="text-xs text-muted mt-1">Click "Seed Default Items" to add common dental supplies, or add manually.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-2 px-1">{CAT_LABELS[cat]}</p>
              <div className="space-y-1.5">
                {catItems.map((item) => {
                  const isExpanded = expanded === item.id;
                  const isLow = item.currentStock <= item.minStock;
                  const isOut = item.currentStock === 0;
                  return (
                    <div key={item.id}
                      className={`rounded-2xl border bg-white overflow-hidden transition-colors ${isOut ? "border-red-200" : isLow ? "border-amber-200" : "border-line"}`}>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-navy truncate">{item.name}</p>
                            <StockBadge current={item.currentStock} min={item.minStock} />
                          </div>
                          {item.notes && <p className="text-[10px] text-muted mt-0.5">{item.notes}</p>}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className={`text-lg font-black ${isOut ? "text-red-600" : isLow ? "text-amber-600" : "text-navy"}`}>
                              {item.currentStock}
                            </p>
                            <p className="text-[10px] text-muted">{item.unit}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => { setAdjustId(adjustId === item.id ? null : item.id); setAdjChange(""); setAdjNote(""); }}
                              className="rounded-full bg-blue/10 text-blue px-2.5 py-1.5 text-[11px] font-bold hover:bg-blue hover:text-white transition-colors">
                              ± Stock
                            </button>
                            <button onClick={() => setExpanded(isExpanded ? null : item.id)}
                              className="rounded-full border border-line px-2.5 py-1.5 text-[11px] font-semibold text-muted hover:bg-bg-soft transition-colors">
                              {isExpanded ? "▲" : "▼"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Stock adjust inline */}
                      {adjustId === item.id && (
                        <div className="border-t border-line px-4 pb-3 pt-2 bg-bg-soft/50">
                          <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-2">Adjust Stock</p>
                          <div className="flex gap-2 flex-wrap items-end">
                            <div className="flex gap-1">
                              {[-5,-3,-1,+1,+3,+5,+10].map((n) => (
                                <button key={n} type="button" onClick={() => setAdjChange(String(n))}
                                  className={`w-9 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    adjChange === String(n)
                                      ? (n < 0 ? "bg-red-600 text-white" : "bg-green-600 text-white")
                                      : (n < 0 ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100")
                                  }`}>
                                  {n > 0 ? `+${n}` : n}
                                </button>
                              ))}
                            </div>
                            <input
                              type="number"
                              value={adjChange}
                              onChange={(e) => setAdjChange(e.target.value)}
                              placeholder="Custom"
                              className="w-20 rounded-xl border border-line px-2 py-1.5 text-sm outline-none focus:border-blue"
                            />
                            <input
                              value={adjNote}
                              onChange={(e) => setAdjNote(e.target.value)}
                              placeholder="Note (e.g. Restocked, Used for procedure)"
                              className="flex-1 min-w-32 rounded-xl border border-line px-3 py-1.5 text-sm outline-none focus:border-blue"
                            />
                            <button onClick={() => adjust(item.id)} disabled={adjSaving || !adjChange}
                              className="rounded-full bg-navy text-white px-4 py-1.5 text-xs font-bold hover:bg-navy-soft disabled:opacity-50 transition-colors">
                              {adjSaving ? "…" : "Save"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Expanded: details + log */}
                      {isExpanded && (
                        <div className="border-t border-line px-4 pb-4 pt-3">
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="rounded-xl bg-bg-soft p-2 text-center">
                              <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">Min Stock</p>
                              <p className="text-sm font-bold text-navy">{item.minStock} {item.unit}</p>
                            </div>
                            <div className="rounded-xl bg-bg-soft p-2 text-center">
                              <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">Cost/Unit</p>
                              <p className="text-sm font-bold text-navy">₹{item.costPerUnit}</p>
                            </div>
                            <div className="rounded-xl bg-bg-soft p-2 text-center">
                              <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">Total Value</p>
                              <p className="text-sm font-bold text-navy">₹{Math.round(item.currentStock * item.costPerUnit).toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                          {item.logs.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-1.5">Recent Logs</p>
                              <div className="space-y-1">
                                {item.logs.map((log) => (
                                  <div key={log.id} className="flex items-center gap-2 text-xs">
                                    <span className={`w-8 text-center font-bold ${log.change > 0 ? "text-green-700" : "text-red-700"}`}>
                                      {log.change > 0 ? `+${log.change}` : log.change}
                                    </span>
                                    <span className="text-muted flex-1">{log.note || "—"}</span>
                                    <span className="text-muted text-[10px]">
                                      {new Date(log.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short" })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <button onClick={() => del(item.id)} className="mt-3 text-[10px] text-red-500 hover:text-red-700 font-semibold transition-colors">
                            🗑 Delete item
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
