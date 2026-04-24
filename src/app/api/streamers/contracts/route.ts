import { NextRequest, NextResponse } from "next/server";

const BFF_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3011/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();

  const search    = searchParams.get("search");
  const status    = searchParams.get("status");
  const packageId = searchParams.get("package_id");

  if (search)    params.set("search",     search);
  if (packageId) params.set("package_id", packageId);
  if (status && status !== "all") params.set("status", status);

  try {
    const res  = await fetch(`${BFF_BASE}/features/streamers/contracts?${params.toString()}`, {
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