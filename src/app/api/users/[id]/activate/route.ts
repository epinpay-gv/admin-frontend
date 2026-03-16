import { User, USER_STATUS } from "@/features/users/types";
import { mockUsers } from "@/mocks/users";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;

  const index = mockUsers.findIndex((u) => u.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  if (mockUsers[index].status === USER_STATUS.ACTIVE) {
    return NextResponse.json(
      { message: "Kullanıcı zaten aktif durumda." },
      { status: 409 }
    );
  }

  const updated: User = {
    ...mockUsers[index],
    status: USER_STATUS.ACTIVE,
    suspension: null,
  };

  mockUsers[index] = updated;

  return NextResponse.json<User>(updated);
}