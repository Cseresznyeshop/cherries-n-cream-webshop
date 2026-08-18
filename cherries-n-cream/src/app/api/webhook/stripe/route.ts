import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Fontos: ez a route-nak NYERS (raw) body-ra van szüksége a Stripe
// aláírás-ellenőrzéshez, ezért Next.js App Routerben a `req.text()`-et
// használjuk JSON.parse helyett, és NEM szabad bodyParsert rátenni.
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook aláírás hiba: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "paid" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
