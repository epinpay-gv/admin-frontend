import { NavGroup } from "@/features/navigation/types";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const BASE_URL = "/api/navigation";

function resolveIcon(iconName: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[iconName] ?? Icons.Circle;
}

function deserializeNavGroups(data: NavGroup[]): NavGroup[] {
  return data.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      icon: typeof item.icon === "string" ? resolveIcon(item.icon) : item.icon,
      children: item.children?.map((child) => ({
        ...child,
        icon: typeof child.icon === "string" ? resolveIcon(child.icon) : child.icon,
      })),
    })),
  }));
}

export const navigationService = {
  getNavigation: async (): Promise<NavGroup[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Navigasyon yüklenemedi.");
    const data = await res.json();
    return deserializeNavGroups(data);
  },
};