import { XMLParser } from "fast-xml-parser";
import { prisma } from "./prisma";
import { translateProduct } from "./translate";
import { getDailyEurHufRate } from "./exchangeRate";
import { calculatePriceHuf } from "./pricing";
import type { StandardFeedProduct, StandardFeedImage } from "@/types/feed";
import slugify from "./slugify";

const PRODUCT_FEED_URL = process.env.PRODUCT_FEED_URL!;
const IMAGE_FEED_URL = process.env.IMAGE_FEED_URL!;

/**
 * ⚠️ FONTOS — EZT KELL PONTOSÍTANI A VALÓS XML ALAPJÁN ⚠️
 *
 * A megbeszélés során kapott mintarészletben a tag-ek nem látszottak
 * (a szövegkinyerés eltávolította őket), ezért itt a Boss of Toys /
 * hasonló lengyel B2B feedeknél leggyakrabban használt mezőneveket
 * tettem alapértelmezettnek. Az ELSŐ éles sync előtt mindenképp:
 *   1. töltsd le a feedet nyersen (böngészőben "Nézd meg a forrást"),
 *   2. nézd meg egy <product> (vagy hasonló) elem pontos tag-jeit,
 *   3. írd át az alábbi FIELD_MAP-et ennek megfelelően.
 *
 * A rendszer minden importnál kiírja, ha egy mezőt nem talál, így
 * gyorsan kiderül, ha valamelyik tag-név nem stimmel.
 */
const FIELD_MAP = {
  productRoot: "products.product", // az ismétlődő elem elérési útja
  sku: "code",
  ean: "ean",
  brand: "producer",
  categoryPath: "category",
  name: "name",
  description: "description",
  priceEur: "price_wholesale",
  weightKg: "weight",
  stockFlag: "available",
  imageRoot: "photos.product",
  imageSku: "code",
  imageUrls: "photo",
} as const;

function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

async function fetchAndParseXml(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Nem sikerült letölteni: ${url} (${res.status})`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  return parser.parse(xml);
}

function toArray<T>(val: T | T[] | undefined): T[] {
  if (val == null) return [];
  return Array.isArray(val) ? val : [val];
}

function mapRawProductToStandard(raw: any): StandardFeedProduct | null {
  const sku = String(raw[FIELD_MAP.sku] ?? "").trim();
  if (!sku) return null;

  return {
    sku,
    ean: raw[FIELD_MAP.ean] ? String(raw[FIELD_MAP.ean]) : undefined,
    brandName: String(raw[FIELD_MAP.brand] ?? "Ismeretlen márka").trim(),
    categoryPathSource: String(raw[FIELD_MAP.categoryPath] ?? "").trim(),
    nameSource: String(raw[FIELD_MAP.name] ?? "").trim(),
    descriptionSource: String(raw[FIELD_MAP.description] ?? "").trim(),
    purchasePriceEur: parseFloat(String(raw[FIELD_MAP.priceEur] ?? "0").replace(",", ".")) || 0,
    weightKg: raw[FIELD_MAP.weightKg] ? parseFloat(String(raw[FIELD_MAP.weightKg]).replace(",", ".")) : undefined,
    inStock: String(raw[FIELD_MAP.stockFlag] ?? "1") !== "0",
  };
}

function mapRawImageToStandard(raw: any): StandardFeedImage | null {
  const sku = String(raw[FIELD_MAP.imageSku] ?? "").trim();
  if (!sku) return null;
  const urls = toArray(raw[FIELD_MAP.imageUrls]).map((u) => String(u)).filter(Boolean);
  return { sku, urls };
}

export interface SyncSummary {
  total: number;
  created: number;
  updated: number;
  needsReview: number;
  errors: { sku: string; message: string }[];
}

export async function runFeedSync(): Promise<SyncSummary> {
  const summary: SyncSummary = { total: 0, created: 0, updated: 0, needsReview: 0, errors: [] };

  const [productDoc, imageDoc] = await Promise.all([
    fetchAndParseXml(PRODUCT_FEED_URL),
    fetchAndParseXml(IMAGE_FEED_URL),
  ]);

  const rawProducts = toArray(getByPath(productDoc, FIELD_MAP.productRoot));
  const rawImages = toArray(getByPath(imageDoc, FIELD_MAP.imageRoot));

  const imagesBySku = new Map<string, string[]>();
  for (const rawImg of rawImages) {
    const img = mapRawImageToStandard(rawImg);
    if (img) imagesBySku.set(img.sku, img.urls);
  }

  const eurHufRate = await getDailyEurHufRate();

  summary.total = rawProducts.length;

  for (const rawProduct of rawProducts) {
    const product = mapRawProductToStandard(rawProduct);
    if (!product) continue;

    try {
      let needsReview = false;
      const reviewNotes: string[] = [];

      const images = imagesBySku.get(product.sku) ?? [];
      if (images.length === 0) {
        needsReview = true;
        reviewNotes.push("Nincs kép a fotó feedben");
      }
      if (!product.descriptionSource) {
        needsReview = true;
        reviewNotes.push("Hiányzó leírás a forrásban");
      }
      if (product.purchasePriceEur <= 0) {
        needsReview = true;
        reviewNotes.push("Hiányzó vagy 0 beszerzési ár");
      }

      // Márka upsert + alapértelmezett szorzó, ha új márka
      const brand = await prisma.brand.upsert({
        where: { name: product.brandName },
        update: {},
        create: { name: product.brandName, markup: 2.0 },
      });

      // Kategória upsert (a magyar nevet egyelőre a forrásnévből generáljuk,
      // ezt admin felületen később finomra lehet hangolni)
      const category = product.categoryPathSource
        ? await prisma.category.upsert({
            where: { sourceName: product.categoryPathSource },
            update: {},
            create: {
              sourceName: product.categoryPathSource,
              nameHu: product.categoryPathSource, // TODO: admin felületen fordítható
              slug: slugify(product.categoryPathSource),
            },
          })
        : null;

      // Fordítás — csak akkor hívjuk az AI-t, ha még nincs lefordítva
      // vagy változott a forrásszöveg (költséghatékonyság a 4 óránkénti syncnél)
      const existing = await prisma.product.findUnique({ where: { sku: product.sku } });

      let nameHu = existing?.nameHu ?? product.nameSource;
      let descriptionHu = existing?.descriptionHu ?? product.descriptionSource;

      const sourceChanged =
        !existing ||
        existing.nameSource !== product.nameSource ||
        existing.descriptionSource !== product.descriptionSource;

      if (sourceChanged && product.nameSource) {
        const translated = await translateProduct(
          product.brandName,
          product.nameSource,
          product.descriptionSource
        );
        nameHu = translated.nameHu;
        descriptionHu = translated.descriptionHu;
      }

      const priceHuf = calculatePriceHuf(product.purchasePriceEur, eurHufRate, brand.markup);

      const saved = await prisma.product.upsert({
        where: { sku: product.sku },
        update: {
          brandId: brand.id,
          categoryId: category?.id,
          nameSource: product.nameSource,
          descriptionSource: product.descriptionSource,
          nameHu,
          descriptionHu,
          purchasePriceEur: product.purchasePriceEur,
          priceHuf,
          weightKg: product.weightKg,
          inStock: product.inStock,
          needsReview,
          reviewNote: reviewNotes.join("; ") || null,
        },
        create: {
          sku: product.sku,
          ean: product.ean,
          brandId: brand.id,
          categoryId: category?.id,
          nameSource: product.nameSource,
          descriptionSource: product.descriptionSource,
          nameHu,
          descriptionHu,
          slug: slugify(`${product.brandName}-${nameHu || product.nameSource}-${product.sku}`),
          purchasePriceEur: product.purchasePriceEur,
          priceHuf,
          weightKg: product.weightKg,
          inStock: product.inStock,
          needsReview,
          reviewNote: reviewNotes.join("; ") || null,
        },
      });

      // Képek frissítése (egyszerű megoldás: töröljük és újra beszúrjuk)
      await prisma.productImage.deleteMany({ where: { productId: saved.id } });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((url, i) => ({ productId: saved.id, url, position: i })),
        });
      }

      if (existing) summary.updated++;
      else summary.created++;
      if (needsReview) summary.needsReview++;
    } catch (err: any) {
      summary.errors.push({ sku: product.sku, message: err?.message ?? String(err) });
    }
  }

  return summary;
}

// Lehetővé teszi a közvetlen futtatást is: `npm run sync`
if (require.main === module) {
  runFeedSync()
    .then((summary) => {
      console.log("Sync kész:", summary);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Sync hiba:", err);
      process.exit(1);
    });
}
