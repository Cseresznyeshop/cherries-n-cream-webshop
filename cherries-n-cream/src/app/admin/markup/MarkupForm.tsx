"use client";

import { useState } from "react";

interface BrandRow {
  id: string;
  name: string;
  markup: number;
  productCount: number;
}

export default function MarkupForm({ brands }: { brands: BrandRow[] }) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(brands.map((b) => [b.id, b.markup]))
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  async function save(id: string) {
    setSavingId(id);
    await fetch("/api/admin/markup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId: id, markup: values[id] }),
    });
    setSavingId(null);
  }

  return (
    <div className="space-y-3">
      {brands.map((b) => (
        <div key={b.id} className="flex items-center gap-4 border-b border-cream/10 pb-3">
          <div className="flex-1">
            <p>{b.name}</p>
            <p className="text-xs text-cream/40">{b.productCount} termék</p>
          </div>
          <input
            type="number"
            step="0.1"
            value={values[b.id]}
            onChange={(e) => setValues((v) => ({ ...v, [b.id]: parseFloat(e.target.value) }))}
            className="w-24 bg-cream/5 border border-cream/20 rounded-soft px-2 py-1 text-center"
          />
          <button
            onClick={() => save(b.id)}
            disabled={savingId === b.id}
            className="px-4 py-1.5 bg-cherry hover:bg-cherryLight rounded-soft text-sm disabled:opacity-50"
          >
            {savingId === b.id ? "Mentés…" : "Mentés"}
          </button>
        </div>
      ))}
    </div>
  );
}
