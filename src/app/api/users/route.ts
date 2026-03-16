
import { NextRequest, NextResponse } from "next/server";
import { mockUserList } from "@/mocks/users";
import { UserListItem } from "@/features/users/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  let result = [...mockUserList];

  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const isPremium = searchParams.get("isPremium");
  const isEmailVerified = searchParams.get("isEmailVerified");
  const isPhoneVerified = searchParams.get("isPhoneVerified");
  const isKycVerified = searchParams.get("isKycVerified");
  const country = searchParams.get("country");

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }

  if (status) {
    result = result.filter((u) => u.status === status);
  }

  if (isPremium !== null) {
    result = result.filter((u) => u.isPremium === (isPremium === "true"));
  }

  if (isEmailVerified !== null) {
    result = result.filter(
      (u) => u.isEmailVerified === (isEmailVerified === "true")
    );
  }

  if (isPhoneVerified !== null) {
    result = result.filter(
      (u) => u.isPhoneVerified === (isPhoneVerified === "true")
    );
  }

  if (isKycVerified !== null) {
    result = result.filter(
      (u) => u.isKycVerified === (isKycVerified === "true")
    );
  }

  if (country) {
    result = result.filter((u) => u.country === country);
  }

  return NextResponse.json<UserListItem[]>(result);
}