import { PageMode } from "@/types/common.types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PALETTE } from "@/lib/status-color";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveMode(id: string): PageMode {
  if (id === "new") return "create";
  if (id.startsWith("copy-")) return "duplicate";
  return "edit";
}

export function resolveId(id: string): number | null {
  if (id === "new") return null;
  if (id.startsWith("copy-")) return Number(id.replace("copy-", ""));
  return Number(id);
}



type StatusConfig<T extends string | number | symbol> = {
  colors: Record<T, { bg: string; color: string }>;
  labels: Record<T, string>;
};

export function buildEntityBadges<T extends string>({
  status,
  mode,
  isDirty,
  config,
}: {
  status?: T;
  mode: "create" | "edit" | "duplicate";
  isDirty?: boolean;
  config: StatusConfig<T>;
}) {
  const badges = [];

  if (mode === "create") {
    badges.push({ label: "Yeni", ...PALETTE.yellow });
  }

  if (mode === "duplicate") {
    badges.push({ label: "Kopya", ...PALETTE.blue });
  }

  if (mode === "edit" && status) {
    badges.push({
      label: config.labels[status],
      ...config.colors[status],
    });
  }

  if (isDirty) {
    badges.push({
      label: "Kaydedilmemiş değişiklikler",
      ...PALETTE.yellow,
    });
  }

  return badges;
}
