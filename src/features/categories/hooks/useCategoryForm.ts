"use client";

import { useState, useEffect, useCallback } from "react";
import { Category, CATEGORY_STATUS, CategoryFaq } from "@/features/categories/types";
import { categoryService } from "@/features/categories/services/category.service";
import { uploadService } from "@/features/products/services/upload.service";
import { toast } from "@/components/common/toast/toast";

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  status: CATEGORY_STATUS;
  metaTitle: string;
  metaDescription: string;
  imgAlt: string;
  content: string;
  genres: string[];
}

const INITIAL_FORM: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  status: CATEGORY_STATUS.ACTIVE,
  metaTitle: "",
  metaDescription: "",
  imgAlt: "",
  content: "",
  genres: [],
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function useCategoryForm(
  category: Category | null,
  mode: "create" | "edit" | "duplicate"
) {
  const [form, setForm] = useState<CategoryFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [faqs, setFaqs] = useState<CategoryFaq[]>([]);

  useEffect(() => {
    if (category) {
      setForm({
        name: mode === "duplicate"
          ? `${category.translation.name} (Kopya)`
          : category.translation.name,
        slug: mode === "duplicate"
          ? `${category.translation.slug}-kopya`
          : category.translation.slug,
        description: category.translation.description ?? "",
        status: mode === "duplicate" ? CATEGORY_STATUS.INACTIVE : category.status,
        metaTitle: category.translation.metaTitle ?? "",
        metaDescription: category.translation.metaDescription ?? "",
        imgAlt: category.translation.imgAlt ?? "",
        content: category.translation.content ?? "",
        genres: category.genres ?? [],
      });
      setImgUrl(category.translation.imgUrl ?? null);
      setFaqs(category.faqs ?? []);
      setIsDirty(false);
      setSlugManuallyEdited(false);
      setPendingFile(null);
    } else {
      setForm(INITIAL_FORM);
      setImgUrl(null);
      setFaqs([]);
      setPendingFile(null);
    }
  }, [category, mode]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => {
        const next = { ...prev, [name]: value };
        if (name === "name" && !slugManuallyEdited) {
          next.slug = generateSlug(value);
        }
        if (name === "slug") {
          setSlugManuallyEdited(true);
          next.slug = generateSlug(value);
        }
        return next;
      });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setIsDirty(true);
    },
    [slugManuallyEdited]
  );

  const handleSelect = useCallback(
    (name: keyof CategoryFormData, value: string) => {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setIsDirty(true);
    },
    []
  );

  const handleGenresChange = useCallback((genres: string[]) => {
    setForm((prev) => ({ ...prev, genres }));
    setIsDirty(true);
  }, []);

  const handleFileChange = useCallback((file: File | null) => {
    setPendingFile(file);
    if (file) {
      setImgUrl(URL.createObjectURL(file));
      setIsDirty(true);
    }
  }, []);

  const handleFaqsChange = useCallback((updatedFaqs: CategoryFaq[]) => {
    setFaqs(updatedFaqs);
    setIsDirty(true);
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Kategori adı zorunludur.";
    if (!form.slug.trim()) newErrors.slug = "URL zorunludur.";
    if (!form.metaTitle.trim()) newErrors.metaTitle = "Meta title zorunludur.";
    if (!form.metaDescription.trim()) newErrors.metaDescription = "Meta description zorunludur.";
    if (!form.imgAlt.trim()) newErrors.imgAlt = "Alt etiket zorunludur.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async (
    onSuccess?: (category: Category) => void,
    locale: string = "tr"
  ) => {
    if (!validate()) {
      toast.error("Hata", "Lütfen zorunlu alanları doldurun.");
      return;
    }

    setSaving(true);
    try {
      let finalImgUrl = imgUrl ?? category?.translation.imgUrl ?? "";

      if (pendingFile) {
        setUploading(true);
        try {
          const uploaded = await uploadService.uploadImage(pendingFile);
          finalImgUrl = uploaded.url;
        } finally {
          setUploading(false);
        }
      }

      const payload: Partial<Category> = {
        slug: form.slug,
        status: form.status,
        genres: form.genres,
        faqs,
        translation: {
          ...(category?.translation ?? { id: 0, locale }),
          locale,
          name: form.name,
          slug: form.slug,
          description: form.description,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          imgAlt: form.imgAlt,
          imgUrl: finalImgUrl,
          content: form.content,
        },
      };

      let result: Category;
      if (mode === "edit" && category) {
        result = await categoryService.update(category.id, payload);
        toast.success("Güncellendi", `${form.name} başarıyla güncellendi.`);
      } else {
        result = await categoryService.create(payload);
        toast.success("Oluşturuldu", `${form.name} başarıyla oluşturuldu.`);
      }

      setIsDirty(false);
      setPendingFile(null);
      onSuccess?.(result);
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes("409") || message.includes("URL zaten")) {
        setErrors((prev) => ({ ...prev, slug: "Bu URL zaten kullanılıyor." }));
        toast.error("Hata", "Bu URL zaten kullanılıyor.");
      } else {
        toast.error(
          "Hata",
          mode === "edit" ? "Kategori güncellenemedi." : "Kategori oluşturulamadı."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    errors,
    saving,
    uploading,
    isDirty,
    imgUrl,
    faqs,
    handleChange,
    handleSelect,
    handleGenresChange,
    handleFileChange,
    handleFaqsChange,
    save,
  };
}