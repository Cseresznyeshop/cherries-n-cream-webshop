import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json();
  const { items, email, phone, billingName, billingAddress, shippingMethod, shippingAddress } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Üres kosár" }, { status: 400 });
  }

  // Az árakat MINDIG az adatbázisból olvassuk vissza, nem a kliens
  // által küldött értékből — így egy manipulált kérés nem tud
  // hamis árat beküldeni.
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: items.map((i: any) => i.productId) } },
  });

  const lineItems = items.map((item: any) => {
    const product = dbProducts.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Ismeretlen termék: ${item.productId}`);
    return {
      product,
      quantity: item.quantity,
    };
  });

  const totalHuf = lineItems.reduce((sum: number, li: any) => sum + li.product.priceHuf * li.quantity, 0);

  // A jogilag bizonyító erejű ÁSZF-elfogadási időbélyeg a SZERVER
  // órája szerint kerül rögzítésre, nem a kliensétől függően.
  const order = await prisma.order.create({
    data: {
      email,
      phone,
      billingName,
      billingAddress,
      shippingMethod,
      shippingAddress,
      aszfAcceptedAt: new Date(),
      totalHuf,
      items: {
        create: lineItems.map((li: any) => ({
          productId: li.product.id,
          quantity: li.quantity,
          unitPriceHuf: li.product.priceHuf,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    // Diszkrét, semleges megnevezés a bankkártya-kivonaton —
    // a tényleges statement descriptort a Stripe fiók beállításainál
    // (Settings → Business → Public details → Statement descriptor)
    // is be kell állítani, ez a mező csak a Checkout oldalra vonatkozik.
    line_items: lineItems.map((li: any) => ({
      price_data: {
        currency: "huf",
        product_data: { name: li.product.nameHu },
        // A HUF a Stripe-nál ún. "zero-decimal" pénznem (nincs
        // váltópénz-egysége, mint a JPY-nek), ezért itt NEM kell
        // ×100-zal szorozni, a forintösszeget közvetlenül várja.
        unit_amount: li.product.priceHuf,
      },
      quantity: li.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/penztar/sikeres?order=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/kosar`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
