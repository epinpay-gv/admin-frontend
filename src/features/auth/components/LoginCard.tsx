"use client";

import { motion } from "framer-motion";
import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <div
      className="flex flex-col justify-center w-full lg:w-[440px] lg:min-w-[440px] px-8 lg:px-14 relative"
      style={{
        background: "#0F1117",
        borderLeft: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white font-mono flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            EP
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            epinpay
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
          Tekrar hoş geldin
        </h1>
        <p className="text-sm text-white/35 mb-8">
          Admin paneline erişmek için giriş yap.
        </p>

        <LoginForm />

        <p className="text-[11px] text-white/15 text-center mt-10 font-mono">
          admin@epinpay.com · moderator@epinpay.com
        </p>
      </motion.div>
    </div>
  );
}