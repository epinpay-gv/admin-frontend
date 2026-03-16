// Kullanııc askıya alma + yeniden aktifleştirme

"use client";

import { useState } from "react";
import { User, SuspendPayload } from "@/features/users/types";
import { userService } from "../services/users.service";


export function useSuspend() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suspend = async (
    userId: number,
    payload: SuspendPayload,
    onSuccess?: (updated: User) => void
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await userService.suspend(userId, payload);
      onSuccess?.(updated);
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Kullanıcı askıya alınamadı.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const activate = async (
    userId: number,
    note?: string,
    onSuccess?: (updated: User) => void
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await userService.activate(userId, note);
      onSuccess?.(updated);
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Kullanıcı aktifleştirilemedi.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { suspend, activate, loading, error };
}
