import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json", {
    next: { revalidate: 86400 }, 
  });

  if (!res.ok) {
    return NextResponse.json({ message: "Ülkeler getirilemedi." }, { status: 500 });
  }

  const data = await res.json();

  const countries = data.map((c: { name: string; "alpha-2": string; "alpha-3": string; region: string }) => ({
    code: c["alpha-2"],
    code3: c["alpha-3"],
    name: c.name,
    region: c.region,
  }));

  return NextResponse.json(countries);
}