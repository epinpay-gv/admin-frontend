"use client";

import { useState, useEffect, useCallback } from "react";
import { Raffle } from "@/features/raffles/types";
import { raffleService } from "@/features/raffles/services/raffle.service";

export function useRaffle(id: string | null) {
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const fetchRaffle = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await raffleService.getById(id);
      setRaffle(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRaffle();
  }, [fetchRaffle, tick]);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const cancelRaffle = useCallback(async (reason?: string) => {
    if (!id) return;
    try {
      await raffleService.cancel(id, reason);
      refresh();
    } catch (err) {
      throw err;
    }
  }, [id, refresh]);

  const drawRaffle = useCallback(async () => {
    if (!id) return;
    try {
      await raffleService.draw(id);
      refresh();
    } catch (err) {
      throw err;
    }
  }, [id, refresh]);

  return { 
    raffle, 
    loading, 
    error, 
    refresh,
    cancelRaffle,
    drawRaffle
  };
}