import { NextRequest, NextResponse } from "next/server";
import { mockCountryPackageVariants } from "@/mocks/streamers";
import { mockPackageTemplates } from "@/mocks/streamers";
import {
  CountryPackageVariant,
  VARIANT_STATUS,
} from "@/features/streamers/types";

function applyFilters(
  variants: CountryPackageVariant[],
  search?: string,
  countryCode?: string,
  templateId?: number,
  status?: VARIANT_STATUS
): CountryPackageVariant[] {
  let result = [...variants];

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (v) =>
        v.countryName.toLowerCase().includes(s) ||
        v.templateName.toLowerCase().includes(s)
    );
  }

  if (countryCode) {
    result = result.filter((v) => v.countryCode === countryCode);
  }

  if (templateId) {
    result = result.filter((v) => v.templateId === templateId);
  }

  if (status) {
    result = result.filter((v) => v.status === status);
  }

  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") ?? undefined;
  const countryCode = searchParams.get("countryCode") ?? undefined;
  const templateId = searchParams.get("templateId")
    ? Number(searchParams.get("templateId"))
    : undefined;
  const status = (searchParams.get("status") as VARIANT_STATUS) ?? undefined;

  const filtered = applyFilters(
    mockCountryPackageVariants,
    search,
    countryCode,
    templateId,
    status
  );

  return NextResponse.json<CountryPackageVariant[]>(filtered);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { templateId, countryCode, currency, durationDays } =
    body as Partial<CountryPackageVariant>;

  if (!templateId || !countryCode || !currency || !durationDays) {
    return NextResponse.json(
      { message: "templateId, countryCode, currency ve durationDays zorunludur." },
      { status: 400 }
    );
  }


  const alreadyExists = mockCountryPackageVariants.some(
    (v) => v.templateId === templateId && v.countryCode === countryCode
  );

  if (alreadyExists) {
    return NextResponse.json(
      { message: "Bu ülke için aynı şablondan varyant zaten mevcut." },
      { status: 409 }
    );
  }

  const template = mockPackageTemplates.find((t) => t.id === templateId);

  if (!template) {
    return NextResponse.json(
      { message: "İlgili paket şablonu bulunamadı." },
      { status: 404 }
    );
  }

  if (template.status === "inactive") {
    return NextResponse.json(
      { message: "Pasif şablondan yeni varyant oluşturulamaz." },
      { status: 422 }
    );
  }

  const newVariant: CountryPackageVariant = {
    id: Date.now(),
    templateId,
    templateName: template.name,
    templateLevel: template.level,
    countryCode,
    countryName: body.countryName ?? countryCode,
    currency,
    durationDays,
    status: VARIANT_STATUS.ACTIVE,
    contents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockCountryPackageVariants.push(newVariant);

  return NextResponse.json<CountryPackageVariant>(newVariant, { status: 201 });
}