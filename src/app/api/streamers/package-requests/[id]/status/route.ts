import { NextRequest, NextResponse } from "next/server";
import { mockPackageRequests, mockCountryPackageVariants } from "@/mocks/streamers";
import {
  PackageRequest,
  PACKAGE_REQUEST_STATUS,
  PACKAGE_LEVEL,
} from "@/features/streamers/types";

const LEVEL_ORDER: Record<PACKAGE_LEVEL, number> = {
  [PACKAGE_LEVEL.BRONZE]: 1,
  [PACKAGE_LEVEL.SILVER]: 2,
  [PACKAGE_LEVEL.GOLD]: 3,
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockPackageRequests.findIndex((r) => r.id === Number(id));

  if (index === -1) {
    return NextResponse.json(
      { message: "Paket talebi bulunamadı." },
      { status: 404 }
    );
  }

  const body = await req.json();
  const { action, adminNote } = body as {
    action: "approve" | "reject";
    adminNote?: string;
  };

  if (!action || !["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { message: "Geçerli bir aksiyon belirtilmelidir: approve veya reject." },
      { status: 400 }
    );
  }

  if (action === "reject" && !adminNote) {
    return NextResponse.json(
      { message: "Red işlemi için açıklama zorunludur." },
      { status: 400 }
    );
  }

  const request = mockPackageRequests[index];

  // Zaten sonuçlandırılmış talep tekrar işlenemez
  if (request.status !== PACKAGE_REQUEST_STATUS.PENDING) {
    return NextResponse.json(
      { message: "Bu talep zaten sonuçlandırılmış." },
      { status: 422 }
    );
  }

  if (action === "approve") {
    // Hedef varyant aktif mi kontrolü
    const targetVariant = mockCountryPackageVariants.find(
      (v) => v.id === request.requestedVariantId
    );

    if (!targetVariant) {
      return NextResponse.json(
        { message: "Talep edilen paket varyantı bulunamadı." },
        { status: 404 }
      );
    }

    if (targetVariant.status === "inactive") {
      return NextResponse.json(
        { message: "Talep edilen paket varyantı aktif değil, onay verilemiyor." },
        { status: 422 }
      );
    }

    // Yükseltme talebinde hedef paket üst seviye mi kontrolü
    if (request.requestType === "upgrade") {
      const currentVariant = mockCountryPackageVariants.find(
        (v) => v.id === request.currentVariantId
      );

      if (currentVariant) {
        const currentLevel = LEVEL_ORDER[currentVariant.templateLevel];
        const targetLevel = LEVEL_ORDER[targetVariant.templateLevel];

        if (targetLevel <= currentLevel) {
          return NextResponse.json(
            { message: "Yükseltme için hedef paket mevcut paketten üst seviye olmalıdır." },
            { status: 422 }
          );
        }
      }
    }
  }

  const now = new Date().toISOString();

  const updated: PackageRequest = {
    ...request,
    status:
      action === "approve"
        ? PACKAGE_REQUEST_STATUS.APPROVED
        : PACKAGE_REQUEST_STATUS.REJECTED,
    adminId: 1, // Mock: sabit admin id
    adminNote: adminNote ?? undefined,
    processedAt: now,
    updatedAt: now,
  };

  mockPackageRequests[index] = updated;

  return NextResponse.json<PackageRequest>(updated);
}