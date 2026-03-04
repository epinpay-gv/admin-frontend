"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DecorativePanel() {
  const radius = 130;
  const text = "stay in the game  *  stay in the game  *  ";

  return (
    <div
      className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center"
      style={{ background: "#000000" }}
    >
      <div className="absolute -top-90 -left-90 opacity-[0.3]">
        <Image src="/branding-vector.png" alt="Epinpay" width={750} height={750} />
      </div>

      <div className="absolute -bottom-90 -right-90 opacity-[0.3]">
        <Image src="/branding-vector.png" alt="Epinpay" width={750} height={750} />
      </div>

      <div className="relative flex items-center justify-center">
        <motion.svg
          width={340}
          height={340}
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
          <text
            style={{
              fontSize: 13,
              fill: "#2DD4C0",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
            }}
          >
            <textPath href="#circlePath" startOffset="0%">
              {text}
            </textPath>
          </text>
        </motion.svg>

        {/* Metalik logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-36 h-36 rounded-3xl flex items-center justify-center"
         
        >
          <img src="/branding-logo.png" alt="Epinpay" width={80} height={80} />
        </motion.div>
      </div>

      {/* Alt yazı */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-16 text-xs tracking-widest font-mono"
        style={{ color: "rgba(45,212,192,0.4)", letterSpacing: "0.3em" }}
      >
        EPINPAY ADMIN
      </motion.p>
    </div>
  );
}