// Ezeket a mezőneveket a valós XML tag-nevek alapján KELL pontosítani —
// lásd a FIELD_MAP-et az importFeed.ts tetején. A lenti interfész a
// feldolgozás UTÁNI, egységesített termékformát írja le, amit a
// mapRawProductToStandard() függvény állít elő a nyers XML rekordból.

export interface StandardFeedProduct {
  sku: string;
  ean?: string;
  brandName: string;
  categoryPathSource: string; // pl. "Zabawki > BDSM > Kajdanki"
  nameSource: string;
  descriptionSource: string;
  purchasePriceEur: number;
  weightKg?: number;
  inStock: boolean;
}

export interface StandardFeedImage {
  sku: string;
  urls: string[];
}
