"use client";

import { useEffect, useRef } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthStore } from "@/store/useAuthStore";

const IDLE_TIMEOUT = 60 * 60 * 1000; // 1 Saat 

export function IdleTimer() {
  const { logout } = useLogout();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        console.log("Hareketsizlik nedeniyle oturum kapatılıyor...");
        logout();
      }, IDLE_TIMEOUT);
    }
  };

  useEffect(() => {
    const events = [
      "mousedown", 
      "mousemove", 
      "keypress", 
      "scroll", 
      "touchstart", 
      "wheel"
    ];
    
    if (isAuthenticated) {      
      resetTimer();      
      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });
    } else {      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, logout]);
  
  return null;
}
