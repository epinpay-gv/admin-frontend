import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Bu endpoint kullanım dışıdır. Veriler AdminBFF üzerinden çekilmektedir." },
    { status: 410 }
  );
}