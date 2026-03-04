"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest, LoginResponse } from "@/features/auth/types";

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const login = async (form: LoginRequest) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: LoginResponse = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Bir hata oluştu, lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
}