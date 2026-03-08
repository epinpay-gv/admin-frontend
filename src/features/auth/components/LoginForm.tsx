"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/common/input/Input";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { LoginRequest } from "@/features/auth/types";

export default function LoginForm() {
  const { login, error, loading } = useLogin();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4">
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="admin@epinpay.com"
        value={form.email}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && login(form)}
        error={error ? " " : undefined}
      />

      <Input
        name="password"
        type="password"
        label="Şifre"
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && login(form)}
        error={error || undefined}
      />

      <Button
        onClick={() => login(form)}
        disabled={loading}
        className="w-full h-11 font-semibold text-white mt-2 group"
        style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Giriş yapılıyor...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Giriş Yap
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </Button>
    </div>
  );
}