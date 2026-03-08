"use client";

import { Bell } from "lucide-react";

export default function NotificationBell() {
  return (
    <button
      className="relative w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
      style={{
        background: "var(--background-card)",
        borderColor: "var(--border)",
        color: "var(--text-secondary)",
      }}
    >
      <Bell size={16} />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00C6A2] border-2"
        style={{ borderColor: "var(--background)" }} />
    </button>
  );
}