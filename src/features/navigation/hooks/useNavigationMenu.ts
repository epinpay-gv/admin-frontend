"use client";

import { useState, useEffect } from "react";
import { NavGroup } from "@/features/navigation/types";
import { navigationService } from "@/features/navigation/services/navigation.service";

export function useNavigationMenu() {
  const [navGroups, setNavGroups] = useState<NavGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigationService
      .getNavigation()
      .then(setNavGroups)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { navGroups, loading, error };
}