import { NextRequest, NextResponse } from "next/server";
import { mockPackageTemplates } from "@/mocks/streamers";
import { PackageTemplate, TemplateContent } from "@/features/streamers/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const template = mockPackageTemplates.find((t) => t.id === Number(id));

  if (!template) {
    return NextResponse.json(
      { message: "Paket şablonu bulunamadı." },
      { status: 404 }
    );
  }

  return NextResponse.json<PackageTemplate>(template);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockPackageTemplates.findIndex((t) => t.id === Number(id));

  if (index === -1) {
    return NextResponse.json(
      { message: "Paket şablonu bulunamadı." },
      { status: 404 }
    );
  }

  const body = await req.json();
  const { name, description, status, contents } = body as Partial<
    PackageTemplate & { contents: TemplateContent[] }
  >;

  // Ad çakışma kontrolü (kendi adı hariç)
  if (name) {
    const nameExists = mockPackageTemplates.some(
      (t) =>
        t.id !== Number(id) && t.name.toLowerCase() === name.toLowerCase()
    );

    if (nameExists) {
      return NextResponse.json(
        { message: "Bu isimde bir şablon zaten mevcut." },
        { status: 409 }
      );
    }
  }

  const existing = mockPackageTemplates[index];

  const updated: PackageTemplate = {
    ...existing,
    ...(name && { name }),
    ...(description !== undefined && { description }),
    ...(status && { status }),
    ...(contents && { contents }),
    updatedAt: new Date().toISOString(),
  };

  mockPackageTemplates[index] = updated;

  return NextResponse.json<PackageTemplate>(updated);
}