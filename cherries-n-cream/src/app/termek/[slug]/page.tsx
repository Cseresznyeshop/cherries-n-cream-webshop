import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { position: "asc" } }, brand: true, category: true },
  });

  if (!product || !product.isPublished) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div className="space-y-3">
        <div className="aspect-square bg-cream/5 rounded-soft overflow-hidden relative">
          {product.images[0] ? (
            <Image src={product.images[0].url} alt={product.nameHu} fill className="object-cover" />
          ) : null}
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {product.images.slice(1, 6).map((img) => (
              <div key={img.id} className="aspect-square bg-cream/5 rounded-soft overflow-hidden relative">
                <Image src={img.url} alt={product.nameHu} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-blush/80">{product.brand.name}</p>
        <h1 className="font-display text-2xl md:text-3xl mt-2 leading-snug">{product.nameHu}</h1>
        <p className="text-2xl text-cherryLight font-medium mt-4">
          {product.priceHuf.toLocaleString("hu-HU")} Ft
        </p>

        <div className="mt-6">
          <AddToCartButton
            productId={product.id}
            sku={product.sku}
            nameHu={product.nameHu}
            priceHuf={product.priceHuf}
            imageUrl={product.images[0]?.url}
          />
        </div>

        <div
          className="prose prose-invert prose-sm mt-8 text-cream/70 max-w-none"
          dangerouslySetInnerHTML={{ __html: product.descriptionHu ?? "" }}
        />

        <p className="mt-8 text-xs text-cream/40">
          Diszkrét csomagolás, semleges feladó megjelöléssel. Cikkszám: {product.sku}
        </p>
      </div>
    </div>
  );
}
