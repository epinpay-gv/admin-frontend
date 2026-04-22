"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { IdleTimer } from "@/features/auth/components/IdleTimer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      <IdleTimer />
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}