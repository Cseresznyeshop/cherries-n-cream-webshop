"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cnc_entry_confirmed_v1";

/**
 * Belépéskor megjelenő kapu: EGY gombbal erősíti meg a látogató, hogy
 * nagykorú ÉS elfogadja az ÁSZF-et. Ez a jogilag szükséges első
 * megerősítés — a másodikra a checkout oldalon kerül sor, a
 * rendelés véglegesítésekor (lásd penztar/page.tsx).
 *
 * Az elfogadás ténye és időpontja a böngészőben (localStorage) kerül
 * eltárolásra a látogató oldalán; a rendeléshez kötött, jogilag
 * bizonyító erejű elfogadást az Order.aszfAcceptedAt mező rögzíti
 * a checkoutnál.
 */
export default function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const confirmed = localStorage.getItem(STORAGE_KEY);
    if (!confirmed) setVisible(true);
  }, []);

  function confirm() {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-sm px-4">
      <div className="max-w-md w-full text-center space-y-6 py-10">
        <p className="uppercase tracking-[0.3em] text-xs text-blush">Cherries N&apos; Cream</p>
        <h1 className="font-display text-2xl text-cream leading-snug">
          Ez az oldal 18 éven felüli látogatóknak szól
        </h1>
        <p className="text-sm text-cream/70 leading-relaxed">
          A belépéssel megerősíted, hogy elmúltál 18 éves, és elfogadod az{" "}
          <Link href="/aszf" className="underline hover:text-blush" target="_blank">
            Általános Szerződési Feltételeket
          </Link>{" "}
          és az{" "}
          <Link href="/adatvedelem" className="underline hover:text-blush" target="_blank">
            Adatkezelési Tájékoztatót
          </Link>
          .
        </p>
        <button
          onClick={confirm}
          className="w-full bg-cherry hover:bg-cherryLight transition-colors rounded-soft py-3 font-medium tracking-wide"
        >
          Elmúltam 18 éves, belépek
        </button>
        <a
          href="https://www.google.com"
          className="block text-xs text-cream/40 hover:text-cream/60"
        >
          Elhagyom az oldalt
        </a>
      </div>
    </div>
  );
}
