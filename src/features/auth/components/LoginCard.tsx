"use client";

import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function LoginCard() {
  const { theme } = useTheme();
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
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          {theme === "dark" ? (
            <Image src="/epinpay-with-text.png" alt="Epinpay" width={140} height={24} />
          ) : (
            <Image src="/epinpay-with-text-dark.png" alt="Epinpay" width={140} height={24} />
          )}
          
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