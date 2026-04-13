import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "@/features/auth/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseToken, email } = body;

    if (!firebaseToken) {
      return NextResponse.json<LoginResponse>(
        { success: false, message: "Token zorunludur." },
        { status: 400 }
      );
    }

    const bffUrl = process.env.ADMIN_BFF_URL || "http://localhost:3011";
    
    // Admin BFF call
    const bffResponse = await fetch(`${bffUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebaseToken, email }),
    });
// 
    const data = await bffResponse.json();

    if (!bffResponse.ok) {
      return NextResponse.json<LoginResponse>(
        { success: false, message: data.message || "Giriş başarısız." },
        { status: bffResponse.status }
      );
    }

    const response = NextResponse.json<LoginResponse>(
      { 
        success: true, 
        message: "Giriş başarılı.",
        user: data.user,
        token: data.token
      },
      { status: 200 }
    );
    response.cookies.set("session", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("BFF Connection Error:", error);
    return NextResponse.json<LoginResponse>(
      { success: false, message: "Sunucu bağlantı hatası." },
      { status: 500 }
    );
  }
}