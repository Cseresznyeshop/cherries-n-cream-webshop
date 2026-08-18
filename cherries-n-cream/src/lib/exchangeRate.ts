import { prisma } from "./prisma";

/**
 * Lekéri a napi hivatalos EUR/HUF középárfolyamot az MNB nyilvános
 * SOAP/XML szolgáltatásából, és elmenti az adatbázisba, hogy az
 * importálás mindig a nap folyamán rögzített árfolyamot használja
 * (ne változzon az ár minden egyes feed-frissítésnél).
 *
 * Ha az MNB szolgáltatás nem elérhető, tartalék forrásként egy
 * publikus exchange-rate API-t hívunk.
 */
export async function getDailyEurHufRate(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);

  const existing = await prisma.exchangeRate.findFirst({
    where: {
      base: "EUR",
      target: "HUF",
      fetchedAt: { gte: new Date(`${today}T00:00:00.000Z`) },
    },
    orderBy: { fetchedAt: "desc" },
  });
  if (existing) return existing.rate;

  const rate = await fetchRateFromMnb().catch(() => fetchRateFallback());

  await prisma.exchangeRate.create({
    data: { base: "EUR", target: "HUF", rate },
  });

  return rate;
}

async function fetchRateFromMnb(): Promise<number> {
  // MNB napi árfolyam XML végpontja (nyilvános, kulcs nélkül hívható)
  const url =
    "https://www.mnb.hu/arfolyamok.asmx/GetCurrentExchangeRates";
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("MNB lekérés sikertelen");
  const xml = await res.text();

  const match = xml.match(/<Rate[^>]*curr="EUR"[^>]*>([\d.,]+)<\/Rate>/i);
  if (!match) throw new Error("EUR árfolyam nem található az MNB válaszban");

  return parseFloat(match[1].replace(",", "."));
}

async function fetchRateFallback(): Promise<number> {
  // Tartalék: exchangerate.host (ingyenes, kulcs nélküli API)
  const res = await fetch("https://api.exchangerate.host/latest?base=EUR&symbols=HUF");
  const data = await res.json();
  const rate = data?.rates?.HUF;
  if (!rate) throw new Error("Nem sikerült árfolyamot lekérni sehonnan");
  return rate;
}
