import { User } from "@/features/users/types";
import { mockUsers } from "@/mocks/users";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// Kullanıcı profil 
export async function GET(
  _req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const user = mockUsers.find((u) => u.id === Number(id));

  if (!user) {
    return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  return NextResponse.json<User>(user);
} 