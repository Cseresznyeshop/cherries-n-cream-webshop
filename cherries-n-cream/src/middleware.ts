import { NextRequest, NextResponse } from "next/server";

// Egyszerű, jelszóval védett admin terület (Basic Auth).
// Éles használat előtt érdemes lehet erősebb megoldásra váltani
// (pl. NextAuth), de induláshoz ez elegendő és gyors védelmet ad.
export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();

  const authHeader = req.headers.get("authorization");
  const expected = "Basic " + Buffer.from(`admin:${process.env.ADMIN_PASSWORD}`).toString("base64");

  if (authHeader !== expected) {
    return new NextResponse("Hitelesítés szükséges", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = { matcher: "/admin/:path*" };
