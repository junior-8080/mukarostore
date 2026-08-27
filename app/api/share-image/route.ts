import { NextRequest, NextResponse } from "next/server";

// Mirrors next.config.ts remotePatterns — only these hosts may be proxied.
const ALLOWED_HOSTNAMES = [
  "images.unsplash.com",
  "plus.unsplash.com",
  "via.placeholder.com",
  "media.dasandacloset.com",
];

function isAllowedHost(hostname: string): boolean {
  if (ALLOWED_HOSTNAMES.includes(hostname)) return true;
  return hostname.endsWith(".r2.dev");
}

// Fetches a product image server-side (bypassing browser CORS) so the client
// can turn it into a File and hand it to navigator.share for WhatsApp Status.
export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("url");
  if (!src) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !isAllowedHost(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  const upstream = await fetch(parsed.toString());
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
