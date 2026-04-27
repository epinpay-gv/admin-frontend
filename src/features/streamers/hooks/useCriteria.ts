"use client";

import { useState, useEffect, useCallback } from "react";
import { PackageCriteria } from "@/features/streamers/types";
import { criteriaService, CreateCriteriaBody } from "../services/streamer.service";

export function useCriteria() {
  const [criteria, setCriteria] = useState<PackageCriteria[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [tick, setTick]         = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    criteriaService.getAll()
      .then((data) => { if (!cancelled) setCriteria(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const createCriteria = useCallback(async (data: CreateCriteriaBody) => {
    const created = await criteriaService.create(data);
    setTick((t) => t + 1);
    return created;
  }, []);

  const updateCriteria = useCallback(async (id: string, data: Partial<CreateCriteriaBody & { is_active: boolean }>) => {
    await criteriaService.update(id, data);
    setTick((t) => t + 1);
  }, []);

  return { criteria, loading, error, refresh, createCriteria, updateCriteria };
}