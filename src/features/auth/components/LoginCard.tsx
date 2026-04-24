"use client";

import { motion } from "framer-motion";
import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <div
      className="flex flex-col justify-center w-full lg:w-110 lg:min-w-110 px-8 lg:px-14 relative border-l"
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
        {/* Logo Bölümü: Mask-Image veya Background-Image kullanarak */}
        <div className="mb-12">
          <div 
            className="w-[140px] h-[24px] bg-no-repeat bg-contain"
            style={{ 
              backgroundImage: 'var(--logo-url)',
            }}
            aria-label="Epinpay Logo"
          />
        </div>

        <h1
          className="text-2xl font-semibold tracking-tight mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Tekrar hoş geldin
        </h1>
        
        {/* ... geri kalan kodlar aynı */}
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Admin paneline erişmek için giriş yap.
        </p>

        <LoginForm />

      </motion.div>
    </div>
  );
}