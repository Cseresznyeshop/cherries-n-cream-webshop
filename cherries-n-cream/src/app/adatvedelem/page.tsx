export default function AdatvedelemPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose prose-invert prose-sm">
      <h1 className="font-display text-2xl">Adatkezelési Tájékoztató</h1>
      <p className="text-cream/50 text-xs">Hatályos: 2026. augusztus 15-től</p>

      <h2>1. Adatkezelő</h2>
      <ul>
        <li>Cherries N&apos; Cream Kft.</li>
        <li>Székhely: 2730 Albertirsa, Pálinkafőző dűlő 11-13</li>
        <li>Adószám: 24755216-2-13</li>
      </ul>

      <h2>2. Kezelt személyes adatok köre és célja</h2>
      <table>
        <thead>
          <tr>
            <th>Adatkezelés</th>
            <th>Kezelt adatok</th>
            <th>Cél</th>
            <th>Jogalap</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Megrendelés</td>
            <td>Név, e-mail, telefonszám, számlázási és szállítási cím</td>
            <td>Rendelés teljesítése, kiszállítás</td>
            <td>Szerződés teljesítése (GDPR 6. cikk (1) b))</td>
          </tr>
          <tr>
            <td>Számlázás</td>
            <td>Név, cím, vásárolt tételek</td>
            <td>Számla kiállítása</td>
            <td>Jogi kötelezettség (GDPR 6. cikk (1) c))</td>
          </tr>
          <tr>
            <td>18 év feletti életkor megerősítése</td>
            <td>A megerősítés ténye és időpontja</td>
            <td>Korhatáros termékek jogszerű értékesítése</td>
            <td>Jogi kötelezettség / jogos érdek</td>
          </tr>
        </tbody>
      </table>

      <p>
        A megvásárolt termékek jellegéből adódóan (szexuális élettel összefüggő termékek) a
        rendelési adatok a GDPR 9. cikke szerinti különleges adatnak minősülhetnek. Ezeket az
        adatokat az Adatkezelő kizárólag a rendelés teljesítéséhez szükséges mértékben, fokozott
        biztonsági intézkedésekkel kezeli, és harmadik félnek — a rendelés teljesítéséhez
        szükséges adatfeldolgozókon kívül — nem adja át.
      </p>

      <h2>3. Adatfeldolgozók</h2>
      <table>
        <thead>
          <tr>
            <th>Szolgáltató</th>
            <th>Tevékenység</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Stripe Payments Europe, Ltd.</td>
            <td>Bankkártyás fizetés lebonyolítása</td>
          </tr>
          <tr>
            <td>GLS General Logistics Systems Hungary Kft.</td>
            <td>Csomagkézbesítés</td>
          </tr>
          <tr>
            <td>Vercel Inc.</td>
            <td>Tárhelyszolgáltatás (hosting)</td>
          </tr>
        </tbody>
      </table>
      <p className="text-cream/40 text-xs">
        Ha a fenti listát a projekt előrehaladtával további szolgáltatóval bővítitek (pl.
        könyvelő program, e-mail küldő rendszer), ezt a táblázatot is bővíteni kell — erre
        emlékeztetni foglak, ha ilyen szolgáltatás bekerül a rendszerbe.
      </p>

      <h2>4. Adatkezelés időtartama</h2>
      <p>
        A számviteli bizonylatokat (számla) a számviteli törvény alapján 8 évig, az egyéb
        rendelési adatokat a polgári jogi elévülési időn belül (5 év) kezeljük.
      </p>

      <h2>5. Az érintett jogai</h2>
      <p>
        Az érintett kérheti személyes adatai megismerését, helyesbítését, törlését, kezelésének
        korlátozását, tiltakozhat az adatkezelés ellen, és élhet adathordozhatósághoz való
        jogával. Kérelmét e-mailben nyújthatja be.
      </p>

      <h2>6. Jogorvoslat</h2>
      <p>
        Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (1055 Budapest, Falk
        Miksa utca 9-11., www.naih.hu) lehet élni, vagy bírósághoz lehet fordulni.
      </p>

      <p className="text-cream/40 text-xs mt-10">
        Ez a dokumentum tervezet, a végleges, éles közzététel előtt jogi szakértővel (ügyvéd)
        történő felülvizsgálata javasolt — különös tekintettel a különleges adatkategóriák
        kezelésére.
      </p>
    </div>
  );
}
