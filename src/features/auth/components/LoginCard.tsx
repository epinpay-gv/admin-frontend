"use client";

import { motion } from "framer-motion";
import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <div
      className="flex flex-col justify-center w-full lg:w-[440px] lg:min-w-[440px] px-8 lg:px-14 relative border-l"
      style={{
        background: "var(--background)",
        borderColor: "var(--border-subtle)",
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
          <span
            className="font-semibold text-lg tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            epinpay
          </span>
        </div>

        <h1
          className="text-2xl font-semibold tracking-tight mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Tekrar hoş geldin
        </h1>
        <p
          className="text-sm mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          Admin paneline erişmek için giriş yap.
        </p>

        <LoginForm />

        <p
          className="text-[11px] text-center mt-10 font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          admin@epinpay.com · moderator@epinpay.com
        </p>
      </motion.div>
    </div>
  );
}