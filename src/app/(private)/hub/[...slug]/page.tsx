"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HUB_PAGES } from "@/mocks/hub";
import { motion } from "framer-motion";

export default function HubPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const key = slug.join("/");
  const hub = HUB_PAGES[key];

  if (!hub) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
          Sayfa bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Üst bar */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {hub.title}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {hub.description}
          </p>
        </div>
      </div>

      {/* Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hub.cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => router.push(card.href)}
              className="relative text-left rounded-xl border p-5 transition-all group"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {card.badge !== undefined && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono text-white"
                  style={{ background: card.color }}
                >
                  {card.badge}
                </span>
              )}

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${card.color}18` }}
              >
                <Icon size={18} style={{ color: card.color }} />
              </div>

              <p
                className="font-semibold text-sm mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {card.title}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {card.description}
              </p>

              <div
                className="flex items-center gap-1 mt-4 text-xs font-mono transition-all group-hover:gap-2"
                style={{ color: card.color }}
              >
                <span>Görüntüle</span>
                <ArrowRight size={12} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}