"use client";

import { SearchBar, NotificationBell, UserMenu, useCurrentUser } from "@/features/header";

export default function Header() {
  const { user } = useCurrentUser();

  return (
    <header
      className="flex items-center h-16 px-6 gap-4 border-b shrink-0"
      style={{ background: "#0F1117", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <SearchBar />

      <div className="flex items-center gap-3 ml-auto">
        <NotificationBell />
        <div className="w-px h-6 bg-white/10" />
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
}