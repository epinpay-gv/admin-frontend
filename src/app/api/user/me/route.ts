import { NextResponse } from "next/server";
import { MOCK_USERS } from "@/mocks/user";

export async function GET() {
  return NextResponse.json(MOCK_USERS);
}
