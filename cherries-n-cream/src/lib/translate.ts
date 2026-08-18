import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface TranslatedProduct {
  nameHu: string;
  descriptionHu: string;
}

/**
 * Lefordítja a termék nevét és leírását lengyelről magyarra.
 *
 * Szabályok (a felhasználó kérése alapján):
 *  - A MÁRKANÉV (pl. "Pretty Love") és a termék saját típusneve
 *    (pl. "Abigail") NEM fordítandó, változatlanul marad.
 *  - Funkciószámok, méretek, egyéb konkrét jellemzők (pl. "12 funkciós")
 *    IGEN fordítandók / magyarosítandók.
 *  - A leírásban maradjon meg a HTML tagolás (<br/> stb.), csak a
 *    szöveg fordítódjon.
 */
export async function translateProduct(
  brandName: string,
  nameSource: string,
  descriptionSource: string
): Promise<TranslatedProduct> {
  const prompt = `Az alábbi termékadatok egy felnőtt-termék (szexshop) nagykereskedői XML feedből származnak, lengyel nyelven. Fordítsd magyarra az alábbi szabályok szerint:

1. A márkanevet ("${brandName}") és a termék saját, tulajdonnévszerű típusnevét (pl. egy modellnév, mint "Abigail") NE fordítsd le, hagyd változatlanul.
2. Minden egyéb szöveget (leírás, funkciók, tulajdonságok, méretek, "X funkciós" jellegű kifejezések) fordíts le természetes, folyékony magyar nyelvre.
3. A leírásban tartsd meg a HTML tag-eket (pl. <br/>) pontosan ott, ahol az eredetiben vannak.
4. Ne adj hozzá és ne hagyj ki tartalmi elemet, csak fordíts.
5. A válaszod KIZÁRÓLAG egy JSON objektum legyen, más szöveg nélkül, ilyen formában:
{"nameHu": "...", "descriptionHu": "..."}

Terméknév (lengyel): ${nameSource}
Leírás (lengyel): ${descriptionSource}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      nameHu: parsed.nameHu ?? nameSource,
      descriptionHu: parsed.descriptionHu ?? descriptionSource,
    };
  } catch {
    // Ha a fordítás valamiért nem parse-olható, az eredeti szöveget
    // tesszük vissza, és a hívó oldal needsReview=true-ra állítja a terméket.
    return { nameHu: nameSource, descriptionHu: descriptionSource };
  }
}
