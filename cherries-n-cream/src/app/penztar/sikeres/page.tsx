"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import Link from "next/link";

export default function SuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-2xl mb-4">Köszönjük a rendelésed!</h1>
      <p className="text-cream/70">
        A visszaigazolást e-mailben küldjük. Rendelésazonosító: {searchParams.order}
      </p>
      <p className="text-cream/50 text-sm mt-2">
        A csomagot diszkrét, semleges csomagolásban adjuk fel.
      </p>
      <Link href="/" className="inline-block mt-8 underline hover:text-blush">
        Vissza a főoldalra
      </Link>
    </div>
  );
}
