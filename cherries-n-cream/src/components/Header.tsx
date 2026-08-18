"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";

export default function Header() {
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <header className="border-b border-cream/10">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-wide">
          Cherries <span className="text-cherryLight">N&apos;</span> Cream
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/aszf" className="text-cream/60 hover:text-cream transition-colors">
            ÁSZF
          </Link>
          <Link href="/kosar" className="relative text-cream hover:text-blush transition-colors">
            Kosár
            {itemCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-cherry rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
