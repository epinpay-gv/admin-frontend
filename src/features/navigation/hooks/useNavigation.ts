"use client";

import { usePathname, useRouter } from "next/navigation";
import { NavGroup } from "../types";
import { NAV_GROUPS } from "@/mocks/navigation";

export function useNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const navGroups: NavGroup[] = NAV_GROUPS;

  const activeHref =
    navGroups
      .flatMap((g) => g.items)
      .find(
        (item) =>
          pathname === item.href || pathname.startsWith(item.href + "/"),
      )?.href ?? pathname;

  const navigate = (href: string) => {
    router.push(href);
  };

  return { navGroups, activeHref, navigate };
}
