import { LegalPage } from "@/features/legal-pages/types";
import { MOCK_LEGAL_PAGES } from "@/mocks/legal.mock";
import { NextRequest, NextResponse } from "next/server";

let legalStore: LegalPage[] = [...MOCK_LEGAL_PAGES];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const page = legalStore.find((p) => p.id === Number(id));

  if (!page) {
    return NextResponse.json({ message: "Sayfa bulunamadı." }, { status: 404 });
  }

  return NextResponse.json<LegalPage>(page);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: Partial<LegalPage>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const index = legalStore.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ message: "Sayfa bulunamadı." }, { status: 404 });
  }

  if (!body.pageName || !body.pageUrl) {
    return NextResponse.json(
      { message: "Sayfa adı ve URL zorunludur." },
      { status: 422 }
    );
  }

  const urlConflict = legalStore.find(
    (p) => p.pageUrl === body.pageUrl && p.id !== Number(id)
  );
  if (urlConflict) {
    return NextResponse.json(
      { message: `"${body.pageUrl}" URL'i başka bir sayfada kullanılıyor.` },
      { status: 409 }
    );
  }

  const updated: LegalPage = {
    ...legalStore[index],
    pageName: body.pageName,
    pageUrl: body.pageUrl,
    contents: body.contents ?? legalStore[index].contents,
    updatedAt: new Date().toISOString(),
  };

  legalStore[index] = updated;

  return NextResponse.json<LegalPage>(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = legalStore.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ message: "Sayfa bulunamadı." }, { status: 404 });
  }

  legalStore = legalStore.filter((p) => p.id !== Number(id));

  return new NextResponse(null, { status: 204 });
}