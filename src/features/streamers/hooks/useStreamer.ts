"use client";

import { useState, useEffect } from "react";
import { Streamer } from "@/features/streamers/types";
import { streamerService } from "../services/streamer.service";

export function useStreamer(id: number | null) {
  const [streamer, setStreamer] = useState<Streamer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await streamerService.getById(id);
        if (!cancelled) setStreamer(data);
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

  return { streamer, loading, error };
}