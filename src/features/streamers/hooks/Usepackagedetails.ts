"use client";

import { useState, useEffect, useCallback } from "react";
import { PackageDetail } from "@/features/streamers/types";
import {
  packageDetailService,
  CreatePackageDetailBody,
} from "../services/streamer.service";


export function usePackageDetails(packageId: string | null) {
  const [details, setDetails]   = useState<PackageDetail[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [tick, setTick]         = useState(0);

  useEffect(() => {
    if (!packageId) return;

    let cancelled = false;

  const fetch = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await packageDetailService.getByPackageId(packageId);
    console.log("getByPackageId response:", JSON.stringify(data, null, 2));
    if (!cancelled) setDetails(data);
  } catch (err) {
    if (!cancelled) setError((err as Error).message);
  } finally {
    if (!cancelled) setLoading(false);
  }
};

    fetch();
    return () => { cancelled = true; };
  }, [packageId, tick]);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  // Yeni versiyon ekle
  const addVersion = useCallback(async (data: CreatePackageDetailBody): Promise<void> => {
    if (!packageId) return;
    setLoading(true);
    try {
      await packageDetailService.addVersion(packageId, data);
      setTick((t) => t + 1);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  // Mevcut (is_current: true) versiyonu güncelle
  const updateCurrent = useCallback(async (data: CreatePackageDetailBody): Promise<void> => {
    if (!packageId) return;
    setLoading(true);
    try {
      await packageDetailService.updateCurrent(packageId, data);
      setTick((t) => t + 1);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  // Mevcut aktif detayı döner (is_current: true olan)
  const currentDetail = details.find((d) => d.isCurrent) ?? null;

  return {
    details,
    currentDetail,
    loading,
    error,
    refresh,
    addVersion,
    updateCurrent,
  };
}

export function usePackageDetail(packageId: string | null) {
  const { details, currentDetail, loading, error, refresh, updateCurrent } =
    usePackageDetails(packageId);

  return {
    detail: currentDetail,
    allVersions: details,
    loading,
    error,
    refresh,
    updateCurrent,
  };
}