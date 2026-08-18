/**
 * Árazási logika.
 *
 * végár (bruttó, HUF) = beszerzési ár (EUR) × napi árfolyam × márka szorzó
 *
 * A feedben lévő ár már a beszállító nettó beszerzési ára EUR-ban.
 * A szorzó (Brand.markup) tartalmazza az árrést ÉS a magyar 27%-os
 * ÁFA-t is — vagyis a szorzót úgy érdemes beállítani admin felületen,
 * hogy már a végleges, fogyasztónak mutatott bruttó ár jöjjön ki.
 *
 * Példa: 23 EUR beszerzési ár, 415 HUF/EUR árfolyam, 2.0 szorzó
 *   => 23 × 415 × 2.0 = 19 090 HUF bruttó végár
 */
export function calculatePriceHuf(
  purchasePriceEur: number,
  eurHufRate: number,
  brandMarkup: number
): number {
  const raw = purchasePriceEur * eurHufRate * brandMarkup;
  // Kerekítés a legközelebbi 10 Ft-ra, hogy szép, kerek árak legyenek
  return Math.round(raw / 10) * 10;
}
