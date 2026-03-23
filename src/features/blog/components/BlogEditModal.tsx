
"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/modal/Modal";
import Input from "@/components/common/input/Input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/common/toast/toast";
import { Blog, BLOG_TRANSLATION_STATUS } from "../types";
import { blogService } from "../service/blog.service";

interface BlogEditModalProps {
  open: boolean;
  onClose: () => void;
  blog: Blog | null;
}

interface BlogEditForm {
  title: string;
  status: BLOG_TRANSLATION_STATUS;
}

const STATUS_OPTIONS: { label: string; value: BLOG_TRANSLATION_STATUS }[] = [
  { label: "Yayında", value: BLOG_TRANSLATION_STATUS.PUBLISHED },
  { label: "Taslak", value: BLOG_TRANSLATION_STATUS.DRAFT },
  { label: "Pasif", value: BLOG_TRANSLATION_STATUS.INACTIVE },
];

const STATUS_COLORS: Record<BLOG_TRANSLATION_STATUS, { bg: string; color: string }> = {
  [BLOG_TRANSLATION_STATUS.PUBLISHED]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [BLOG_TRANSLATION_STATUS.DRAFT]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
  [BLOG_TRANSLATION_STATUS.INACTIVE]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
};

export default function BlogEditModal({ open, onClose, blog }: BlogEditModalProps) {
  const [form, setForm] = useState<BlogEditForm>({
    title: "",
    status: BLOG_TRANSLATION_STATUS.DRAFT,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      // Kaynak dile ait translation'ı bul
      const sourceTranslation = blog.translations.find(
        (t) => t.language === blog.sourceLanguage
      );
      setForm({
        title: sourceTranslation?.title ?? "",
        status: sourceTranslation?.status ?? BLOG_TRANSLATION_STATUS.DRAFT,
      });
    }
  }, [blog]);

  const handleSubmit = async () => {
    if (!blog) return;
    setLoading(true);
    try {
      await blogService.update(blog.id, {
        translations: blog.translations.map((t) =>
          t.language === blog.sourceLanguage
            ? { ...t, title: form.title, status: form.status }
            : t
        ),
      });
      toast.success("Blog güncellendi", `${form.title} başarıyla güncellendi.`);
      onClose();
    } catch {
      toast.error("Hata oluştu", "Blog güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Blog Güncelle"
      description={
        blog?.translations.find((t) => t.language === blog.sourceLanguage)?.slug
      }
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="text-sm text-white"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Kaydediliyor...
              </span>
            ) : (
              "Kaydet"
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          name="title"
          label="Blog Başlığı"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Blog başlığı"
        />

        {/* Durum seçici — 3 seçenekli */}
        <div>
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Durum
          </p>
          <div className="flex items-center gap-2">
            {STATUS_OPTIONS.map((option) => {
              const isSelected = form.status === option.value;
              const colors = STATUS_COLORS[option.value];
              return (
                <button
                  key={option.value}
                  onClick={() => setForm((prev) => ({ ...prev, status: option.value }))}
                  className="text-[11px] font-bold px-3 py-1 rounded-full font-mono border transition-all"
                  style={{
                    background: isSelected ? colors.bg : "transparent",
                    color: isSelected ? colors.color : "var(--text-muted)",
                    borderColor: isSelected ? colors.color : "var(--border)",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}