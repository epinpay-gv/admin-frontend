"use client";
import { useState, useEffect, useCallback } from "react";
import { PackageRequest } from "@/features/streamers/types";
import { packageRequestService } from "../services/streamer.service";


export function usePackageRequest(id: number | null) {
  const [request, setRequest] = useState<PackageRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchRequest = useCallback(async () => {
    if (!id) return;

    let cancelled = false;

    setLoading(true);
    setError(null);
    try {
      const data = await packageRequestService.getById(id);
      if (!cancelled) setRequest(data);
    } catch (err) {
      if (!cancelled) setError((err as Error).message);
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

 
  const approve = useCallback(
    async (adminNote?: string): Promise<PackageRequest> => {
      if (!id) throw new Error("Talep ID bulunamadı.");
      setActionLoading(true);
      setActionError(null);
      try {
        const updated = await packageRequestService.approve(id, adminNote);
        setRequest(updated);
        return updated;
      } catch (err) {
        const message = (err as Error).message;
        setActionError(message);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [id]
  );

  // Talebi reddeder. 
  const reject = useCallback(
    async (adminNote: string): Promise<PackageRequest> => {
      if (!id) throw new Error("Talep ID bulunamadı.");
      setActionLoading(true);
      setActionError(null);
      try {
        const updated = await packageRequestService.reject(id, adminNote);
        setRequest(updated);
        return updated;
      } catch (err) {
        const message = (err as Error).message;
        setActionError(message);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [id]
  );

  return {
    request,
    loading,
    error,
    actionLoading,
    actionError,
    approve,
    reject,
    refresh: fetchRequest,
  };
}