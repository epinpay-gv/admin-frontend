"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "../services/auth.service";
import { LoginRequest, LoginResponse } from "@/features/auth/types";

export function useLogin() {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated } = useAuthStore();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const login = async (form: LoginRequest) => {
    setError("");
    setLoading(true);

    try {
      // 0. Configuration check
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        setError("Firebase yapılandırması eksik (.env dosyasını kontrol edin).");
        setLoading(false);
        return;
      }

      // 1. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const idToken = await userCredential.user.getIdToken();

      // 2. Call internal API route to set session cookie via BFF
      const data = await authService.login({
        firebaseToken: idToken,
        email: form.email,
      });

      if (!data.success) {
        setError(data.message);
        return;
      }

      // 3. Save user to store
      if (data.user) {
        setUser(data.user);
        if (data.token) setToken(data.token);
        setAuthenticated(true);
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login hatası:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Email veya şifre hatalı.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Çok fazla başarısız deneme. Lütfen daha sonra tekrar dene.");
      } else {
        setError("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
}