"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";

export default function CartPage() {
  const { items, removeItem, setQuantity, totalHuf } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-cream/60 mb-6">A kosarad üres.</p>
        <Link href="/" className="underline hover:text-blush">
          Vissza a termékekhez
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-2xl mb-8">Kosár</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 border-b border-cream/10 pb-4">
            <div className="flex-1">
              <p className="text-sm">{item.nameHu}</p>
              <p className="text-cherryLight text-sm mt-1">{item.priceHuf.toLocaleString("hu-HU")} Ft</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => setQuantity(item.productId, Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 bg-cream/5 border border-cream/20 rounded-soft px-2 py-1 text-center"
            />
            <button
              onClick={() => removeItem(item.productId)}
              className="text-cream/40 hover:text-cherryLight text-sm"
            >
              Törlés
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-cream/60">Összesen</span>
        <span className="text-xl font-medium">{totalHuf().toLocaleString("hu-HU")} Ft</span>
      </div>

      <Link
        href="/penztar"
        className="mt-6 block text-center w-full px-8 py-3 bg-cherry hover:bg-cherryLight rounded-soft font-medium transition-colors"
      >
        Tovább a pénztárhoz
      </Link>
    </div>
  );
}
