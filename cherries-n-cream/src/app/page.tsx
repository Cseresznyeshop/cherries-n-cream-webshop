import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const revalidate = 300; // 5 percenként újragenerálódik a lista

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true, inStock: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, brand: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 max-w-xl">
        <p className="uppercase tracking-[0.3em] text-xs text-blush">Diszkrét intim wellness</p>
        <h1 className="font-display text-3xl md:text-4xl mt-3 leading-tight">
          Gondosan válogatott termékek, észrevétlen csomagolásban
        </h1>
      </div>

      {products.length === 0 ? (
        <p className="text-cream/50">
          A termékkatalógus hamarosan feltöltésre kerül az első import lefutása után.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                slug: p.slug,
                nameHu: p.nameHu,
                priceHuf: p.priceHuf,
                imageUrl: p.images[0]?.url,
                brandName: p.brand?.name ?? "",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
