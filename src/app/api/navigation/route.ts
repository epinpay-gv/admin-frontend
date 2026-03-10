import { NextResponse } from "next/server";
import { NAV_GROUPS } from "@/mocks/navigation";
import { LucideIcon } from "lucide-react";

function getIconName(icon: LucideIcon | string): string {
  if (typeof icon === "string") return icon;
  return (icon as { displayName?: string; name?: string }).displayName ?? (icon as { name?: string }).name ?? "Circle";
}

export async function GET() {
  const serialized = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      icon: getIconName(item.icon),
      children: item.children?.map((child) => ({
        ...child,
        icon: getIconName(child.icon),
      })),
    })),
  }));

  return NextResponse.json(serialized);
}