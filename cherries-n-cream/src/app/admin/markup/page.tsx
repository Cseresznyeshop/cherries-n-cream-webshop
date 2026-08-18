import { prisma } from "@/lib/prisma";
import MarkupForm from "./MarkupForm";

export default async function AdminMarkupPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-2xl mb-2">Márkánkénti árszorzók</h1>
      <p className="text-cream/60 text-sm mb-8">
        végár = beszerzési ár (EUR) × napi árfolyam × szorzó. A szorzó tartalmazza az árrést és a
        27%-os ÁFA-t is.
      </p>
      <MarkupForm brands={brands.map((b) => ({ id: b.id, name: b.name, markup: b.markup, productCount: b._count.products }))} />
    </div>
  );
}
