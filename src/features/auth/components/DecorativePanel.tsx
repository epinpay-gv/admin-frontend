"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DecorativePanel() {
  const radius = 130;

  return (
    <div
      className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center"
      style={{ background: "#000000" }}
    >
      {/* Köşe görseller */}
      <div className="absolute -top-90 -left-90 opacity-[0.3]">
        <Image src="/branding-vector.png" alt="" width={750} height={750} />
      </div>
      <div className="absolute -bottom-90 -right-90 opacity-[0.3]">
        <Image src="/branding-vector.png" alt="" width={750} height={750} />
      </div>

      {/* Dönen çember + logo */}
      <div className="relative flex items-center justify-center">
        <motion.svg
          width={450}
          height={450}
          viewBox="0 0 340 340"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute"
        >
          <defs>
            <path
              id="circlePath"
              d={`M 170,170 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            />
          </defs>

          {/* Üst yarı — stay in the game */}
          <text
            style={{
              fontSize: 13,
              fill: "#2DD4C0",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
            }}
          >
            <textPath href="#circlePath" startOffset="0%">
             *  stay in the game  *
            </textPath>
          </text>

          {/* Alt yarı — the way to the game (tam simetrik karşı taraf) */}
          <text
            style={{
              fontSize: 13,
              fill: "#2DD4C0",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
            }}
          >
            <textPath href="#circlePath" startOffset="50%">
             *  the way to the game  *
            </textPath>
          </text>
        </motion.svg>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-50 h-50 rounded-3xl flex items-center justify-center"
        >
          <Image src="/branding-logo.png" alt="Epinpay" width={120} height={120} />
        </motion.div>
      </div>

      {/* Alt yazı */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-16 text-lg tracking-widest font-mono"
        style={{ color: "rgba(45,212,192,0.4)", letterSpacing: "0.3em" }}
      >
        EPINPAY
      </motion.p>
    </div>
  );
}