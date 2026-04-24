import { NextRequest, NextResponse } from "next/server";

const BFF_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3011/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;

  try {
    const res  = await fetch(`${BFF_BASE}/admin/packages/${id}`, {
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

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body   = await req.json();

  try {
    const res  = await fetch(`${BFF_BASE}/admin/packages/${id}`, {
      method:  "PATCH",
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

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;

  try {
    const res  = await fetch(`${BFF_BASE}/admin/packages/${id}`, {
      method: "DELETE",
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