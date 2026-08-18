import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-sm text-cream/60">
        <div>
          <p className="font-display text-cream text-base mb-2">Cherries N&apos; Cream Kft.</p>
          <p>2730 Albertirsa, Pálinkafőző dűlő 11-13</p>
          <p>Adószám: 24755216-2-13</p>
        </div>
        <div className="space-y-2">
          <p className="text-cream mb-1">Jogi tudnivalók</p>
          <Link href="/aszf" className="block hover:text-cream">Általános Szerződési Feltételek</Link>
          <Link href="/adatvedelem" className="block hover:text-cream">Adatkezelési Tájékoztató</Link>
          <Link href="/elallas" className="block hover:text-cream">Elállási jog</Link>
        </div>
        <div className="space-y-2">
          <p className="text-cream mb-1">Szállítás &amp; fizetés</p>
          <p>Diszkrét csomagolásban, GLS futárral vagy csomagponton</p>
          <p>Csak előre utalás / bankkártyás fizetés</p>
        </div>
      </div>
    </footer>
  );
}
