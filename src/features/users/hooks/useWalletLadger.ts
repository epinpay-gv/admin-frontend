// Cüzdan hareketleri görüntüleme + filtreleme

"use client";

import { useEffect, useState } from "react";
import { WalletEntry, LedgerFilter } from "@/features/users/types";
import { userService } from "../services/users.service";

export function useWalletLedger(userId: number, filters?: LedgerFilter) {
  const [entries, setEntries] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    userService
      .getWalletLedger(userId, filters)
      .then(setEntries)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId, JSON.stringify(filters)]);

  return { entries, loading, error };
}