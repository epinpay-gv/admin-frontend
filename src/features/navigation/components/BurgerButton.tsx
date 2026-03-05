"use client";

import { motion } from "framer-motion";

interface BurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function BurgerButton({ isOpen, onClick }: BurgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors gap-1.5"
    >
      <motion.span
        animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
        className="block w-4 h-0.5 rounded-full bg-white/70"
      />
      <motion.span
        animate={isOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="block w-4 h-0.5 rounded-full bg-white/70"
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
        className="block w-4 h-0.5 rounded-full bg-white/70"
      />
    </button>
  );
}