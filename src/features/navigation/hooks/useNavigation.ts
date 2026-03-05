"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NAV_GROUPS } from "@/mocks/navigation";

export function useNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeHref, setActiveHref] = useState(pathname);

  const navigate = (href: string) => {
    setActiveHref(href);
    router.push(href);
  };

  return {
    navGroups: NAV_GROUPS,
    activeHref,
    navigate,
  };
}