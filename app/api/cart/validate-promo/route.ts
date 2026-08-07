import { NextRequest, NextResponse } from "next/server";
import { PROMO_CODES } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = await req.json() as { code?: string };
  const code = (body.code ?? "").trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const percentOff = PROMO_CODES[code];
  if (percentOff !== undefined) {
    return NextResponse.json({ valid: true, percentOff });
  }

  return NextResponse.json({ valid: false });
}
