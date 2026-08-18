# Cherries N' Cream — webshop

Teljesen Shopify-független webshop: Next.js + PostgreSQL (Prisma) + Vercel hosting,
automatikus XML termékimporttal, magyar fordítással, EUR→HUF árazással és Stripe fizetéssel.

## ⚠️ Amit ÉN nem tudok innen elvégezni — ezekhez kellesz Te

1. **Stripe fiók** létrehozása és a `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` beszerzése
   (dashboard.stripe.com). A webhook végpont: `https://[a-te-domained]/api/webhook/stripe`,
   figyelendő esemény: `checkout.session.completed`.
   ⚠️ Beszéltük, hogy a Stripe hivatalosan nem engedélyezi a felnőtt tartalmat/terméket — a
   fizikai szexshop-termékek "szürke zónában" vannak, de a fiók bármikor felülvizsgálható,
   felfüggeszthető. Ajánlott a Stripe Dashboardban a Settings → Business → Statement
   descriptor mezőt egy semleges névre állítani (pl. "CNC WEBSHOP").
2. **Adatbázis** létrehozása (pl. Vercel Postgres, Neon.tech vagy Supabase — mindegyiknél van
   ingyenes csomag) → a kapott kapcsolati stringet be kell másolni a `DATABASE_URL`-be.
3. **Anthropic API kulcs** a fordításhoz (console.anthropic.com) → `ANTHROPIC_API_KEY`.
4. **XML feed mezőnevek pontosítása** — lásd lent, ez FONTOS az első sync előtt.
5. **cseresznyeveled.hu domain átirányítása** a régi Shopify oldalról az új Vercel projektre,
   amikor készen álltok az élesítésre (ezt Vercel-ben a Domains menüpont alatt lehet
   beállítani, majd a domain-szolgáltatódnál — ahol a cseresznyeveled.hu-t regisztráltátok —
   kell módosítani a DNS-rekordokat).
6. **Jogi átvizsgálás** — az ÁSZF, Adatkezelési tájékoztató és Elállási tájékoztató a ti valós
   adataitokkal készült, de éles közzététel előtt érdemes ügyvéddel átnézetni, főleg a
   különleges adatkategóriák (GDPR 9. cikk) kezelése miatt.

## ⚠️ FONTOS: az XML feed mezőneveinek ellenőrzése

A `src/lib/importFeed.ts` tetején található `FIELD_MAP` objektum feltételezett tag-neveket
tartalmaz (pl. `code`, `name`, `price_wholesale`), mert a megbeszélés során kapott feed-részlet
szövegkinyerés közben elvesztette az XML tag-eket, így nem láttam a pontos neveket.

**Az első futtatás előtt:**
1. Nyisd meg böngészőben a termék XML linket, jobb klikk → "Oldal forráskódjának megtekintése"
2. Keress meg egy teljes terméket leíró blokkot (valószínűleg `<product>...</product>` vagy
   hasonló), és nézd meg a pontos tag-neveket (pl. lehet `<code>` helyett `<symbol>` vagy
   `<kod>`, stb.)
3. Írd át ennek megfelelően a `FIELD_MAP`-et az `importFeed.ts`-ben

Ha elakadsz, küldd el nekem a nyers (tag-ekkel együtt) XML-részletet egy új beszélgetésben, és
pontosítom a kódot.

## Megjegyzés az adatbázis-frissítésről

Mivel nincs saját fejlesztői gépi környezeted, a `build` parancs minden telepítéskor automatikusan
szinkronizálja az adatbázis-struktúrát a `schema.prisma` alapján (`prisma db push`). Ez induláshoz
kényelmes, de fejlettebb, "éles" workflow-nál (amikor már valós rendelések/vásárlói adatok vannak
az adatbázisban) érdemesebb áttérni a Prisma "migrate" rendszerére, ami biztonságosabban kezeli a
séma-változtatásokat. Ha idáig eljutunk, jelezd, és átállítjuk.

## Helyi fejlesztés

```bash
npm install
cp .env.example .env       # töltsd ki a valós értékekkel
npx prisma migrate dev     # létrehozza a táblákat az adatbázisban
npm run dev                # http://localhost:3000
```

## Első termékimport kézi futtatása

```bash
npm run sync
```

Ez lehúzza a két XML feedet, lefordítja az új/változott termékeket, kiszámolja az árakat, és
feltölti az adatbázist. A kimeneten látod, hány termék készült/frissült, és hányat kell manuálisan
átnézned (`needsReview`).

## Éles telepítés (Vercel)

1. Told fel ezt a projektet egy GitHub repóba
2. Hozz létre egy új projektet a vercel.com-on, kösd össze a repóval
3. Add meg a `.env.example`-ben szereplő összes környezeti változót a Vercel projekt
   Settings → Environment Variables alatt
4. Deploy — a `vercel.json` automatikusan beállítja a 4 óránkénti cron jobot
5. A Stripe Dashboardban állítsd be a webhookot az éles domainre mutatva

## Márkánkénti árszorzók kezelése

`https://[domain]/admin/markup` — jelszóval védett (lásd `ADMIN_PASSWORD`), itt tudod
márkánként beállítani/módosítani a szorzót; mentéskor az adott márka minden termékének ára
azonnal újraszámolódik.

## Amit még érdemes hozzáadni, ha ez az alap már működik

- Rendelés-visszaigazoló e-mail automatikus kiküldése (pl. Resend vagy Postmark)
- Készletfigyelés / "elfogyott" jelzés a feed `available` mezője alapján
- Kategória-fordítás admin felülete (jelenleg a lengyel kategórianév kerül alapértelmezetten
  kitöltésre a `nameHu` mezőbe, ezt egyelőre kézzel kell szerkeszteni adatbázis-szinten)
- Rendelési e-mail sablon diszkrét feladóval
