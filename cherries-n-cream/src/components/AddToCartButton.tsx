"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";

export default function AddToCartButton({
  productId,
  sku,
  nameHu,
  priceHuf,
  imageUrl,
}: {
  productId: string;
  sku: string;
  nameHu: string;
  priceHuf: number;
  imageUrl?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        addItem({ productId, sku, nameHu, priceHuf, imageUrl });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="w-full md:w-auto px-8 py-3 bg-cherry hover:bg-cherryLight rounded-soft font-medium transition-colors"
    >
      {added ? "Kosárba került ✓" : "Kosárba teszem"}
    </button>
  );
}
