"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const storeLogout = useAuthStore((state) => state.logout);

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      storeLogout();
      router.push("/login");
    } catch {
      console.error("Çıkış yapılırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}