import { SuspendPayload, User, USER_STATUS } from "@/features/users/types";
import { mockUsers } from "@/mocks/users";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const body: SuspendPayload = await req.json();

  const index = mockUsers.findIndex((u) => u.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  if (mockUsers[index].status === USER_STATUS.SUSPENDED) {
    return NextResponse.json(
      { message: "Kullanıcı zaten askıya alınmış durumda." },
      { status: 409 }
    );
  }

  if (!body.reason) {
    return NextResponse.json(
      { message: "Askıya alma nedeni zorunludur." },
      { status: 400 }
    );
  }

  const updated: User = {
    ...mockUsers[index],
    status: USER_STATUS.SUSPENDED,
    suspension: {
      id: Date.now(),
      reason: body.reason,
      note: body.note ?? null,
      suspendedAt: new Date().toISOString(),
      expiresAt: body.expiresAt ?? null,
      suspendedBy: "admin@epinpay.com", 
    },
  };

  mockUsers[index] = updated;

  return NextResponse.json<User>(updated);
}