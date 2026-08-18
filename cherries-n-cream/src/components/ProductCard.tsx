import Link from "next/link";
import Image from "next/image";

export interface ProductCardData {
  slug: string;
  nameHu: string;
  priceHuf: number;
  imageUrl?: string;
  brandName: string;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/termek/${product.slug}`}
      className="group block rounded-soft overflow-hidden border border-cream/10 hover:border-blush/40 transition-colors"
    >
      <div className="aspect-square bg-cream/5 relative overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.nameHu}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cream/20 text-xs">
            Nincs kép
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-blush/80">{product.brandName}</p>
        <p className="font-display text-cream mt-1 leading-snug line-clamp-2">{product.nameHu}</p>
        <p className="mt-2 text-cherryLight font-medium">
          {product.priceHuf.toLocaleString("hu-HU")} Ft
        </p>
      </div>
    </Link>
  );
}
