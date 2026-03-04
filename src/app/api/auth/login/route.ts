import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS } from "@/mocks/user";
import { LoginRequest, LoginResponse } from "@/features/auth/types";

const ADMIN_ROLES = ["super_admin", "admin"];

export async function POST(request: NextRequest) {
  const body: LoginRequest = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json<LoginResponse>(
      { success: false, message: "Email ve şifre zorunludur." },
      { status: 400 }
    );
  }

  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    return NextResponse.json<LoginResponse>(
      { success: false, message: "Kullanıcı bulunamadı." },
      { status: 401 }
    );
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    return NextResponse.json<LoginResponse>(
      { success: false, message: "Bu panele erişim yetkiniz yok." },
      { status: 403 }
    );
  }

  const response = NextResponse.json<LoginResponse>(
    { success: true, message: "Giriş başarılı." },
    { status: 200 }
  );

  response.cookies.set("session", `mock-session-${user.uid}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 gün
    path: "/",
  });

  return response;
}