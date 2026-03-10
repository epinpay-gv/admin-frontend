"use client";

import { usePathname, useRouter } from "next/navigation";
import { useNavigationMenu } from "./useNavigationMenu";

export function useNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { navGroups, loading, error } = useNavigationMenu();

  const activeHref = navGroups
    .flatMap((g) => g.items)
    .find(
      (item) =>
        pathname === item.href || pathname.startsWith(item.href + "/")
    )?.href ?? pathname;

  const navigate = (href: string) => {
    router.push(href);
  };

  return { navGroups, activeHref, navigate, loading, error };
}