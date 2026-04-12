"use client";

import { useState } from "react";
import Modal from "@/components/common/modal/Modal";
import { useRedirectCreate } from "@/features/redirect/hooks/useRedirectCreate";

interface RedirectCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PLACEHOLDER = `/eski-sayfa::/yeni-sayfa
/kampanya-2023::/kampanyalar
/urun/eski-slug::/urunler/yeni-slug`;

export default function RedirectCreateModal({
  open,
  onClose,
  onSuccess,
}: RedirectCreateModalProps) {
  const [raw, setRaw] = useState("");
  const { submit, loading, error } = useRedirectCreate(() => {
    onSuccess();
    onClose();
    setRaw("");
  });

  const handleSubmit = async () => {
    await submit(raw);
  };

  const handleClose = () => {
    setRaw("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Yeni Yönlendirme"
      description="Her satıra bir yönlendirme girin. Format: /eski-url::/yeni-url"
      size="md"
    >
      <div className="space-y-4">
        {/* Textarea */}
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={6}
          className="w-full text-sm font-mono rounded-xl px-4 py-3 resize-none outline-none border transition-colors"
          style={{
            background: "var(--background-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />

        {/* Format ipucu */}
        <div
          className="text-xs font-mono px-3 py-2 rounded-lg"
          style={{
            background: "rgba(0,133,255,0.06)",
            color: "var(--text-muted)",
            border: "1px solid rgba(0,133,255,0.12)",
          }}
        >
          💡 Birden fazla satır ekleyebilirsiniz. Her satır{" "}
          <span style={{ color: "#0085FF" }}>::</span> ile ayrılmalıdır.
        </div>

        {/* Hata mesajı */}
        {error && (
          <div
            className="text-xs font-mono px-3 py-2 rounded-lg"
            style={{
              background: "rgba(255,80,80,0.07)",
              color: "#FF5050",
              border: "1px solid rgba(255,80,80,0.15)",
            }}
          >
            {error}
          </div>
        )}

        {/* Gönder butonu */}
        <button
          onClick={handleSubmit}
          disabled={loading || !raw.trim()}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{
            background: "#00C6A2",
            color: "#fff",
          }}
        >
          {loading ? "Ekleniyor..." : "Gönder"}
        </button>
      </div>
    </Modal>
  );
}