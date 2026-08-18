import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDailyEurHufRate } from "@/lib/exchangeRate";
import { calculatePriceHuf } from "@/lib/pricing";

export async function POST(req: Request) {
  const { brandId, markup } = await req.json();
  if (!brandId || typeof markup !== "number" || markup <= 0) {
    return NextResponse.json({ error: "Érvénytelen adat" }, { status: 400 });
  }

  const brand = await prisma.brand.update({ where: { id: brandId }, data: { markup } });

  // A szorzó módosítása után azonnal újraárazzuk az adott márka
  // minden termékét, hogy ne kelljen megvárni a következő 4 órás syncet.
  const eurHufRate = await getDailyEurHufRate();
  const products = await prisma.product.findMany({ where: { brandId } });

  await Promise.all(
    products.map((p) =>
      prisma.product.update({
        where: { id: p.id },
        data: { priceHuf: calculatePriceHuf(p.purchasePriceEur, eurHufRate, brand.markup) },
      })
    )
  );

  return NextResponse.json({ ok: true, updatedProducts: products.length });
}
