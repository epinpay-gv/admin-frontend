"use client";

import { useState, useEffect } from "react";
import { Raffle } from "@/features/raffles/types";
import { raffleService } from "@/features/raffles/services/raffle.service";

export function useRaffle(id: string | null) {
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await raffleService.getById(id);
        if (!cancelled) setRaffle(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { raffle, loading, error };
}