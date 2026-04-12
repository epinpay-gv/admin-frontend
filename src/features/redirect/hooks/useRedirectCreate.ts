"use client";

import { useState } from "react";
import { RedirectEntry } from "@/features/redirect/types";
import { redirectService } from "@/features/redirect/services/redirect.service";

function urlManipulate(raw: string): RedirectEntry[] {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("En az bir yönlendirme girmelisiniz.");
  }

  return lines.map((line) => {
    const parts = line.split("::");

    if (parts.length !== 2) {
      throw new Error(
        `Hatalı format: "${line}" — Beklenen format: /eski-url::/yeni-url`
      );
    }

    let [url_from, url_to] = parts.map((p) => p.trim());

    // epinpay.com domain'ini temizle
    const domainPattern = /^https?:\/\/[^/]+/;
    url_from = url_from.replace(domainPattern, "");
    url_to = url_to.replace(domainPattern, "");

    if (!url_from.startsWith("/") || !url_to.startsWith("/")) {
      throw new Error(
        `URL'ler / ile başlamalıdır: "${line}"`
      );
    }

    return { url_from, url_to };
  });
}

export function useRedirectCreate(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (raw: string): Promise<boolean> => {
    setError(null);

    let entries: RedirectEntry[];

    try {
      entries = urlManipulate(raw);
    } catch (err) {
      setError((err as Error).message);
      return false;
    }

    setLoading(true);
    try {
      await redirectService.create({ redirects: entries });
      onSuccess();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}