"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/common/modal/Modal";
import Input from "@/components/common/input/Input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/common/toast/toast";
import { blogService } from "../service/blog.service";
import { Blog, BLOG_STATUS } from "../types/blog.types";

interface BlogEditModalProps {
  open: boolean;
  onClose: () => void;
  blog: Blog | null;
}

interface BlogEditForm {
  title: string;
  status: BLOG_STATUS;
}

const STATUS_OPTIONS: { label: string; value: BLOG_STATUS }[] = [
  { label: "Yayında", value: BLOG_STATUS.PUBLISHED },
  { label: "Taslak", value: BLOG_STATUS.DRAFT },
  { label: "Arşiv", value: BLOG_STATUS.ARCHIVED },
];

const STATUS_COLORS: Record<BLOG_STATUS, { bg: string; color: string }> = {
  [BLOG_STATUS.PUBLISHED]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [BLOG_STATUS.DRAFT]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
  [BLOG_STATUS.ARCHIVED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
};

export default function BlogEditModal({ open, onClose, blog }: BlogEditModalProps) {
  const [form, setForm] = useState<BlogEditForm>({
    title: "",
    status: BLOG_STATUS.DRAFT,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      const firstTranslation = blog.translations[0];
      setForm({
        title: firstTranslation?.title ?? "",
        status: blog.status,
      });
    }
  }, [blog]);

  const handleSubmit = async () => {
    if (!blog) return;
    const firstTranslation = blog.translations[0];
    if (!firstTranslation) return;

    setLoading(true);
    try {
      // Update the title via translation update
      await blogService.updateTranslation(blog.id, firstTranslation.locale, {
        title: form.title,
      });

      // If status changed, update it separately
      if (form.status !== blog.status) {
        await blogService.changeStatus(blog.id, form.status);
      }

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
      description={blog?.slug}
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

        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
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