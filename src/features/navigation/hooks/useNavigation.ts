import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/mocks/navigation";

export function useNavigation() {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState(pathname);

  return {
    navGroups: NAV_GROUPS,
    activeHref,
    setActiveHref,
  };
}