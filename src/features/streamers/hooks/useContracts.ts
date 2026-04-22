"use client";

import { useState, useEffect, useCallback } from "react";
import { ContractWithRelations, Contract, ContractFilters } from "@/features/streamers/types";
import {
  contractService,
  UpdateContractStatusBody,
  ApproveContractBody,
  RejectContractBody,
} from "../services/streamer.service";

const DEFAULT_FILTERS: ContractFilters = {
  search:    "",
  status:    "all",
  packageId: undefined,
};

export function useContracts() {
  const [contracts, setContracts]   = useState<ContractWithRelations[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [filters, setFiltersState]  = useState<ContractFilters>(DEFAULT_FILTERS);
  const [tick, setTick]             = useState(0);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getAll(filters);
      setContracts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, tick]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const setFilters = useCallback((newFilters: ContractFilters) => {
    setFiltersState(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  return {
    contracts,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refresh,
  };
}

export function useContract(id: string | null) {
  const [contract, setContract] = useState<ContractWithRelations | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [tick, setTick]         = useState(0);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await contractService.getById(id);
        if (!cancelled) setContract(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [id, tick]);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const updateStatus = useCallback(async (data: UpdateContractStatusBody): Promise<void> => {
    if (!id) return;
    try {
      await contractService.updateStatus(id, data);
      setTick((t) => t + 1);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [id]);

  const approve = useCallback(async (data: ApproveContractBody): Promise<void> => {
    if (!id) return;
    try {
      await contractService.approve(id, data);
      setTick((t) => t + 1);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [id]);

  const reject = useCallback(async (data: RejectContractBody): Promise<void> => {
    if (!id) return;
    try {
      await contractService.reject(id, data);
      setTick((t) => t + 1);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [id]);

  return {
    contract,
    loading,
    error,
    refresh,
    updateStatus,
    approve,
    reject,
  };
}