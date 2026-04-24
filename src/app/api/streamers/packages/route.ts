import { NextRequest, NextResponse } from "next/server";

const BFF_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3011/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();

  const search   = searchParams.get("search");
  const isActive = searchParams.get("is_active");

  if (search)   params.set("search",    search);
  if (isActive && isActive !== "all") params.set("is_active", isActive);

  try {
    const res  = await fetch(`${BFF_BASE}/features/streamers/packages?${params.toString()}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Paket servisi yanıt vermedi." },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res  = await fetch(`${BFF_BASE}/features/streamers/packages`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Paket servisi yanıt vermedi." },
      { status: 503 }
    );
  }
}