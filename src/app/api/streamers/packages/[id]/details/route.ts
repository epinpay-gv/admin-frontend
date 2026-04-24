import { NextRequest, NextResponse } from "next/server";

const BFF_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3011/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;

  try {
    const res  = await fetch(`${BFF_BASE}/features/streamers/packages/${id}/details`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Paket detay servisi yanıt vermedi." },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body   = await req.json();

  try {
    const res  = await fetch(`${BFF_BASE}/features/streamers/packages/${id}/details`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Paket detay servisi yanıt vermedi." },
      { status: 503 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body   = await req.json();

  try {
    const res  = await fetch(`${BFF_BASE}/features/streamers/packages/${id}/details/current`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Paket detay servisi yanıt vermedi." },
      { status: 503 }
    );
  }
}