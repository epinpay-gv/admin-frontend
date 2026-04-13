"use client";

import { useState } from "react";
import Modal from "@/components/common/modal/Modal";
import Input from "@/components/common/input/Input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/common/toast/toast";
import { useLegalPageCreate } from "@/features/legal-pages/hooks/useLegalPageCreate";

interface LegalPageCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (id: number) => void;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function LegalPageCreateModal({
  open,
  onClose,
  onSuccess,
}: LegalPageCreateModalProps) {
  const [pageName, setPageName] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [urlTouched, setUrlTouched] = useState(false);

  const { create, loading, error } = useLegalPageCreate((id) => {
    toast.success("Sayfa oluşturuldu", `${pageName} başarıyla oluşturuldu.`);
    handleClose();
    onSuccess(id);
  });

  const handleNameChange = (value: string) => {
    setPageName(value);
    if (!urlTouched) {
      setPageUrl(toSlug(value));
    }
  };

  const handleUrlChange = (value: string) => {
    setUrlTouched(true);
    setPageUrl(toSlug(value));
  };

  const handleSubmit = async () => {
    if (!pageName.trim() || !pageUrl.trim()) return;
    await create({ pageName, pageUrl, contents: [] });
  };

  const handleClose = () => {
    setPageName("");
    setPageUrl("");
    setUrlTouched(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Yeni Yasal Sayfa"
      description="Sayfa adını girin, URL otomatik oluşturulur."
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !pageName.trim() || !pageUrl.trim()}
            className="text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Oluşturuluyor...
              </span>
            ) : (
              "Oluştur"
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          name="pageName"
          label="Sayfa Adı"
          value={pageName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="örn: Gizlilik Politikası"
        />
        <Input
          name="pageUrl"
          label="Sayfa URL"
          value={pageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="gizlilik-politikasi"
          prefix="/"
        />

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
      </div>
    </Modal>
  );
}