import { NextRequest, NextResponse } from "next/server";
import { mockRaffles } from "@/mocks/raffles";
import { Raffle, RAFFLE_STATUS, AUDIT_ACTION } from "@/features/raffles/types";

const VALID_TRANSITIONS: Record<RAFFLE_STATUS, RAFFLE_STATUS[]> = {
  [RAFFLE_STATUS.DRAFT]: [RAFFLE_STATUS.ACTIVE, RAFFLE_STATUS.CANCELLED],
  [RAFFLE_STATUS.ACTIVE]: [RAFFLE_STATUS.INACTIVE, RAFFLE_STATUS.CANCELLED],
  [RAFFLE_STATUS.INACTIVE]: [RAFFLE_STATUS.ACTIVE, RAFFLE_STATUS.CANCELLED],
  [RAFFLE_STATUS.FINISHED]: [],
  [RAFFLE_STATUS.CANCELLED]: [],
};

const ACTION_MAP: Record<string, AUDIT_ACTION> = {
  [RAFFLE_STATUS.ACTIVE]: AUDIT_ACTION.PUBLISHED,
  [RAFFLE_STATUS.INACTIVE]: AUDIT_ACTION.DEACTIVATED,
  [RAFFLE_STATUS.CANCELLED]: AUDIT_ACTION.CANCELLED,
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status, description } = body as {
    status: RAFFLE_STATUS;
    description?: string;
  };

  const index = mockRaffles.findIndex((r) => r.id === id);

  if (index === -1) {
    return NextResponse.json(
      { message: "Çekiliş bulunamadı." },
      { status: 404 }
    );
  }

  const raffle = mockRaffles[index];
  const allowed = VALID_TRANSITIONS[raffle.status];

  if (!allowed.includes(status)) {
    return NextResponse.json(
      {
        message: `"${raffle.status}" durumundan "${status}" durumuna geçiş yapılamaz.`,
      },
      { status: 422 }
    );
  }

  const auditLog = {
    id: `AL-${Date.now()}`,
    action: ACTION_MAP[status] ?? AUDIT_ACTION.CREATED,
    adminId: "admin-001",
    adminName: "Admin",
    description: description ?? undefined,
    createdAt: new Date().toISOString(),
  };

  const updated: Raffle = {
    ...raffle,
    status,
    cancelReason:
      status === RAFFLE_STATUS.CANCELLED ? description : raffle.cancelReason,
    auditLogs: [...raffle.auditLogs, auditLog],
    updatedAt: new Date().toISOString(),
  };

  mockRaffles[index] = updated;
  return NextResponse.json<Raffle>(updated);
}