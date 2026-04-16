import { NextResponse } from "next/server";
import { LoginResponse } from "@/features/auth/types";

export async function POST() {
  const response = NextResponse.json<LoginResponse>(
    { success: true, message: "Çıkış başarılı." },
    { status: 200 }
  );

  response.cookies.delete("token");

  return response;
}