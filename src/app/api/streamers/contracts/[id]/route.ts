import { NextRequest, NextResponse } from "next/server";

const BFF_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3011/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;

  try {
    const res  = await fetch(`${BFF_BASE}/features/streamers/contracts/${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Sözleşme servisi yanıt vermedi." },
      { status: 503 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body   = await req.json();

  let endpoint = `${BFF_BASE}/features/streamers/contracts/${id}`;

  if (body.action === "approve") {
    endpoint = `${BFF_BASE}/features/streamers/contracts/${id}/approve`;
    delete body.action;
  } else if (body.action === "reject") {
    endpoint = `${BFF_BASE}/features/streamers/contracts/${id}/reject`;
    delete body.action;
  }

  try {
    const res  = await fetch(endpoint, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Sözleşme servisi yanıt vermedi." },
      { status: 503 }
    );
  }
}