export default function AszfPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose prose-invert prose-sm">
      <h1 className="font-display text-2xl">Általános Szerződési Feltételek</h1>
      <p className="text-cream/50 text-xs">Hatályos: 2026. augusztus 15-től</p>

      <h2>1. A Szolgáltató adatai</h2>
      <ul>
        <li>Cégnév: Cherries N&apos; Cream Kft.</li>
        <li>Székhely: 2730 Albertirsa, Pálinkafőző dűlő 11-13</li>
        <li>Adószám: 24755216-2-13</li>
        <li>Webshop: cseresznyeveled.hu</li>
      </ul>

      <h2>2. Alapvető rendelkezések</h2>
      <p>
        Jelen ÁSZF a cseresznyeveled.hu webáruházban (a továbbiakban: Webáruház) leadott
        rendelésekre vonatkozik. A Webáruházban kizárólag 18. életévüket betöltött, cselekvőképes
        személyek vásárolhatnak. A megrendelés leadásával a Vásárló kijelenti, hogy elmúlt 18
        éves, és elfogadja a jelen ÁSZF-et.
      </p>

      <h2>3. A szerződés létrejötte</h2>
      <p>
        A megrendelés a Webáruházon keresztül, elektronikus úton leadott ajánlatnak minősül. A
        szerződés a rendelés Szolgáltató általi visszaigazolásával jön létre. A Szolgáltató a
        visszaigazolást e-mailben küldi meg a Vásárló részére.
      </p>

      <h2>4. Árak, fizetés</h2>
      <p>
        A Webáruházban feltüntetett árak forintban (HUF) értendők, és tartalmazzák a törvényben
        előírt általános forgalmi adót (ÁFA). A fizetés kizárólag előre, bankkártyás fizetéssel
        (Stripe fizetési szolgáltatón keresztül) történik. Utánvétes fizetésre nincs lehetőség.
      </p>

      <h2>5. Szállítás</h2>
      <p>
        A megrendelt termékeket a Szolgáltató GLS futárszolgálattal, diszkrét, semleges
        csomagolásban, a feladó cégnevének feltüntetése nélkül juttatja el a Vásárlóhoz — a
        Vásárló választása szerint GLS csomagpontra vagy házhozszállítással.
      </p>

      <h2>6. Elállási jog</h2>
      <p>
        A fogyasztót a 45/2014. (II. 26.) Korm. rendelet alapján 14 napos indokolás nélküli
        elállási jog illeti meg. Ez alól kivételt képeznek a zárt csomagolású, egészségvédelmi
        vagy higiéniai okokból az átadást követő felbontás után vissza nem küldhető termékek
        (jellemzően az intim higiéniai és testre kerülő termékek) — amennyiben ezek csomagolását
        a Vásárló felbontotta, elállási joga ezekre a termékekre nem gyakorolható. Részletek az{" "}
        <a href="/elallas" className="underline hover:text-blush">
          Elállási tájékoztatóban
        </a>
        .
      </p>

      <h2>7. Szavatosság</h2>
      <p>
        A Szolgáltatót a Ptk. és a fogyasztóvédelmi jogszabályok szerinti kellékszavatossági
        kötelezettség terheli az értékesített termékekre vonatkozóan.
      </p>

      <h2>8. Panaszkezelés</h2>
      <p>
        A Vásárló panaszaival a Szolgáltató elérhetőségein keresztül, írásban élhet. A
        Szolgáltató a panaszt a jogszabályban előírt határidőn belül kivizsgálja és arra választ
        ad.
      </p>

      <p className="text-cream/40 text-xs mt-10">
        Ez a dokumentum tervezet, a végleges, éles közzététel előtt jogi szakértővel (ügyvéd)
        történő felülvizsgálata javasolt.
      </p>
    </div>
  );
}
