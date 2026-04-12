import { NextRequest, NextResponse } from "next/server";

import { Redirect, RedirectEntry } from "@/features/redirect/types";
import { mockRedirects } from "@/mocks/redirect";

let redirectStore: Redirect[] = [...mockRedirects];

function applyFilters(redirects: Redirect[], searchParams: URLSearchParams): Redirect[] {
  let result = [...redirects];

  const search = searchParams.get("search")?.toLowerCase();

  if (search) {
    result = result.filter(
      (r) =>
        r.url_from.toLowerCase().includes(search) ||
        r.url_to.toLowerCase().includes(search)
    );
  }

  return result.sort((a, b) => b.id - a.id);
}

export async function GET(req: NextRequest) {
  const filtered = applyFilters(redirectStore, req.nextUrl.searchParams);
  return NextResponse.json<Redirect[]>(filtered);
}

export async function POST(req: NextRequest) {
  let body: { redirects: RedirectEntry[] };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const { redirects } = body;

  if (!Array.isArray(redirects) || redirects.length === 0) {
    return NextResponse.json(
      { message: "En az bir yönlendirme gönderilmelidir." },
      { status: 422 }
    );
  }

  const invalid = redirects.find(
    (r) => !r.url_from?.startsWith("/") || !r.url_to?.startsWith("/")
  );

  if (invalid) {
    return NextResponse.json(
      { message: "Tüm URL'ler / ile başlamalıdır." },
      { status: 422 }
    );
  }

  const duplicate = redirects.find((r) =>
    redirectStore.some((existing) => existing.url_from === r.url_from)
  );

  if (duplicate) {
    return NextResponse.json(
      { message: `"${duplicate.url_from}" zaten mevcut.` },
      { status: 409 }
    );
  }

  const maxId = redirectStore.reduce((max, r) => Math.max(max, r.id), 0);

  const created: Redirect[] = redirects.map((r, i) => ({
    id: maxId + i + 1,
    url_from: r.url_from,
    url_to: r.url_to,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  redirectStore = [...redirectStore, ...created];

  return NextResponse.json<Redirect[]>(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));

  if (isNaN(id) || id === 0) {
    return NextResponse.json({ message: "Geçersiz ID." }, { status: 400 });
  }

  const exists = redirectStore.find((r) => r.id === id);

  if (!exists) {
    return NextResponse.json({ message: "Yönlendirme bulunamadı." }, { status: 404 });
  }

  redirectStore = redirectStore.filter((r) => r.id !== id);

  return new NextResponse(null, { status: 204 });
}