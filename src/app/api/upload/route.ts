import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ message: "Dosya bulunamadı." }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { message: "Geçersiz dosya türü. Yalnızca JPG, PNG, WEBP desteklenir." },
      { status: 400 }
    );
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { message: "Dosya boyutu 10MB'ı geçemez." },
      { status: 400 }
    );
  }

  // Gerçek CDN entegrasyonu burada yapılacak
  // Şimdilik mock CDN URL dönüyoruz
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
  const mockCdnUrl = `https://cdn.epinpay.com/products/${fileName}`;

  // Simüle edilmiş gecikme
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    url: mockCdnUrl,
    fileName,
    size: file.size,
    type: file.type,
  });
}