// Bu mock API route artık kullanılmıyor.
// Teklif verileri doğrudan AdminBFF'ten çekiliyor.
// Dosya Next.js routing hatası vermemesi için boş bırakılmıştır.

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Bu endpoint kullanım dışıdır. Veriler AdminBFF üzerinden çekilmektedir." },
    { status: 410 }
  );
}