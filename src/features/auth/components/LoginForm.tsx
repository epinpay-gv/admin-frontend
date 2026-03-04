"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { LoginRequest } from "@/features/auth/types";

export default function LoginForm() {
  const { login, error, loading } = useLogin();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-white/40 font-mono uppercase tracking-widest">
          Email
        </label>
        <Input
          name="email"
          type="email"
          placeholder="admin@epinpay.com"
          value={form.email}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && login(form)}
          className="h-11 bg-white/5 border-white/10 text-white/80 placeholder:text-white/20 focus-visible:ring-[#00C6A2]/30 focus-visible:border-[#00C6A2]/50 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-white/40 font-mono uppercase tracking-widest">
          Şifre
        </label>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && login(form)}
            className="h-11 pr-11 bg-white/5 border-white/10 text-white/80 placeholder:text-white/20 focus-visible:ring-[#00C6A2]/30 focus-visible:border-[#00C6A2]/50 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 font-mono bg-red-400/8 border border-red-400/15 px-3 py-2.5 rounded-lg"
        >
          {error}
        </motion.p>
      )}

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