"use client";

import { Bell } from "lucide-react";

export default function NotificationBell() {
  return (
    <button className="relative w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors">
      <Bell size={16} />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00C6A2] border-2 border-[#0F1117]" />
    </button>
  );
}