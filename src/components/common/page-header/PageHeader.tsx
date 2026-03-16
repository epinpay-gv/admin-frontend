"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  count?: number;
  countLabel?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  count,
  countLabel = "kayıt",
  actions,
}: PageHeaderProps) {
  return (
    <div className="shrink-0 flex items-center justify-between mb-6 pt-2">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        {description ? (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        ) : count !== undefined ? (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Toplam{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {count}
            </span>{" "}
            {countLabel} yönetiliyor
          </p>
        ) : null}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}