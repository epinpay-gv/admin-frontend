import { LegalPage } from "@/features/legal-pages/types";
import { MOCK_LEGAL_PAGES } from "@/mocks/legal.mock";
import { NextRequest, NextResponse } from "next/server";

let legalStore: LegalPage[] = [...MOCK_LEGAL_PAGES];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase();

  let result = [...legalStore];

  if (search) {
    result = result.filter(
      (page) =>
        page.pageName.toLowerCase().includes(search) ||
        page.pageUrl.toLowerCase().includes(search)
    );
  }

  return NextResponse.json<LegalPage[]>(result);
}

export async function POST(req: NextRequest) {
  let body: Partial<LegalPage>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  if (!body.pageName || !body.pageUrl) {
    return NextResponse.json(
      { message: "Sayfa adı ve URL zorunludur." },
      { status: 422 }
    );
  }

  const duplicate = legalStore.find((p) => p.pageUrl === body.pageUrl);
  if (duplicate) {
    return NextResponse.json(
      { message: `"${body.pageUrl}" URL'i zaten mevcut.` },
      { status: 409 }
    );
  }

  const maxId = legalStore.reduce((max, p) => Math.max(max, p.id), 0);

  const created: LegalPage = {
    id: maxId + 1,
    pageName: body.pageName,
    pageUrl: body.pageUrl,
    contents: body.contents ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  legalStore = [...legalStore, created];

  return NextResponse.json<LegalPage>(created, { status: 201 });
}