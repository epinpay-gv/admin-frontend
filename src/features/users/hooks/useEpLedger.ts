// EP hareketleri görüntüleme + filtreleme
"use client";

import { useEffect, useState } from "react";
import { EPEntry, LedgerFilter } from "@/features/users/types";
import { userService } from "../services/users.service";

export function useEPLedger(userId: number, filters?: LedgerFilter) {
  const [entries, setEntries] = useState<EPEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    userService
      .getEPLedger(userId, filters)
      .then(setEntries)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId, JSON.stringify(filters)]);

  return { entries, loading, error };
}