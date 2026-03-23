import { NextRequest, NextResponse } from "next/server";
import { mockPackageTemplates } from "@/mocks/streamers";
import { PackageTemplate, TEMPLATE_STATUS } from "@/features/streamers/types";

function applyFilters(
  templates: PackageTemplate[],
  search?: string,
  status?: TEMPLATE_STATUS
): PackageTemplate[] {
  let result = [...templates];

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(s) ||
        t.description?.toLowerCase().includes(s)
    );
  }

  if (status) {
    result = result.filter((t) => t.status === status);
  }

  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") ?? undefined;
  const status = (searchParams.get("status") as TEMPLATE_STATUS) ?? undefined;

  const filtered = applyFilters(mockPackageTemplates, search, status);

  return NextResponse.json<PackageTemplate[]>(filtered);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, level, description } = body as Partial<PackageTemplate>;

  if (!name || !level) {
    return NextResponse.json(
      { message: "Şablon adı ve seviyesi zorunludur." },
      { status: 400 }
    );
  }

  const nameExists = mockPackageTemplates.some(
    (t) => t.name.toLowerCase() === name.toLowerCase()
  );

  if (nameExists) {
    return NextResponse.json(
      { message: "Bu isimde bir şablon zaten mevcut." },
      { status: 409 }
    );
  }

  const newTemplate: PackageTemplate = {
    id: Date.now(),
    name,
    level,
    description,
    status: TEMPLATE_STATUS.ACTIVE,
    contents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockPackageTemplates.push(newTemplate);

  return NextResponse.json<PackageTemplate>(newTemplate, { status: 201 });
}