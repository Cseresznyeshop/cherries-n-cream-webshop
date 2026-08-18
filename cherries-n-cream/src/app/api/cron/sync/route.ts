import { NextResponse } from "next/server";
import { runFeedSync } from "@/lib/importFeed";

// A Vercel Cron ezt a végpontot hívja 4 óránként (lásd vercel.json).
// A CRON_SECRET-tel védjük, hogy más ne tudja kívülről elindítani
// a szinkronizálást (ami AI-fordítási költséggel is jár).
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Jogosulatlan" }, { status: 401 });
  }

  try {
    const summary = await runFeedSync();
    return NextResponse.json({ ok: true, summary });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
