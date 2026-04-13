"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Category,
  CATEGORY_STATUS,
  CategoryCountry,
  CategoryFaq,
  CategoryCreatePayload,
  CategoryUpdatePayload,
} from "@/features/categories/types";
import { categoryService } from "@/features/categories/services/category.service";
import { uploadService } from "@/features/products/services/upload.service";
import { useCountries } from "@/features/products/hooks/useCountries";
import { toast } from "@/components/common/toast/toast";
import { useRouter } from "next/navigation";
import { Locale } from "@/components/common/locale-selector/locale.service";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LocaleFormData {
  name: string;
  imgAlt: string;
  imgUrl: string;
  metaTitle: string;
  description: string;
  metaDescription: string;
  faq: CategoryFaq[];
}

export interface CategoryFormData extends LocaleFormData {
  slug: string;
  status: CATEGORY_STATUS;
}

const EMPTY_LOCALE_DATA: LocaleFormData = {
  name: "",
  imgAlt: "",
  imgUrl: "",
  metaTitle: "",
  description: "",
  metaDescription: "",
  faq: [],
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

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCategoryForm(
  category: Category | null,
  mode: "create" | "edit" | "duplicate",
) {
  const router = useRouter();

  // Countries list — used to resolve string codes → CategoryCountry objects
  const { countries } = useCountries();

  // Shared fields
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<CATEGORY_STATUS>(CATEGORY_STATUS.ACTIVE);

  // Forbidden countries — CategoryCountry[] matching what CategoryFormCountries expects
  const [forbiddenCountries, setForbiddenCountries] = useState<CategoryCountry[]>([]);

  // Per-locale translation data
  const [translations, setTranslations] = useState<Record<string, LocaleFormData>>({
    tr: { ...EMPTY_LOCALE_DATA },
  });

  // Locale state
  const [activeLocale, setActiveLocale] = useState("tr");
  const [enabledLocales, setEnabledLocales] = useState<string[]>(["tr"]);

  // Other state
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // ── Populate from category ─────────────────────────────────────────────────
// In useCategoryForm.ts
// Replace the category population useEffect.
// Key fix: slug is NOT part of LocaleFormData — don't include it when seeding locale slots.

  useEffect(() => {
    if (category) {
      const t = category.translation;

      // Shared fields
      setSlug(mode === "duplicate" ? `${t.slug}-kopya` : t.slug);
      setStatus(mode === "duplicate" ? CATEGORY_STATUS.INACTIVE : category.status);
      setImgUrl(t.imgUrl ?? null);
      setIsDirty(false);
      setSlugManuallyEdited(false);
      setPendingFile(null);

      const locales = category.availableLocales?.length ? category.availableLocales : ["tr"];
      setEnabledLocales(locales);
      const preferred = locales.includes("tr") ? "tr" : locales[0];
      setActiveLocale(preferred);

      const initialTranslations: Record<string, LocaleFormData> = {};

      if (category.translations && Object.keys(category.translations).length > 0) {
        // Full translations map available — seed every locale correctly
        locales.forEach((code) => {
          const lt = category.translations![code];
          if (lt) {
            initialTranslations[code] = {
              name:            mode === "duplicate" && code === preferred
                                 ? `${lt.name} (Kopya)`
                                 : lt.name,
              imgAlt:          lt.imgAlt          ?? "",
              imgUrl:          lt.imgUrl          ?? "",
              metaTitle:       lt.metaTitle       ?? "",
              description:     lt.description     ?? "",
              metaDescription: lt.metaDescription ?? "",
              faq:             lt.faq             ?? [],
              // slug is NOT here — it's shared state, set via setSlug above
            };
          } else {
            initialTranslations[code] = { ...EMPTY_LOCALE_DATA };
          }
        });
      } else {
        // Fallback: only primary translation available (e.g. from list-view fetch)
        locales.forEach((code) => {
          initialTranslations[code] = { ...EMPTY_LOCALE_DATA };
        });
        const seedLocale = t.locale || preferred;
        initialTranslations[seedLocale] = {
          name:            mode === "duplicate" ? `${t.name} (Kopya)` : t.name,
          imgAlt:          t.imgAlt          ?? "",
          imgUrl:          t.imgUrl          ?? "",
          metaTitle:       t.metaTitle       ?? "",
          description:     t.description     ?? "",
          metaDescription: t.metaDescription ?? "",
          faq:             t.faq             ?? [],
        };
      }

      setTranslations(initialTranslations);
    } else {
      setSlug("");
      setStatus(CATEGORY_STATUS.ACTIVE);
      setImgUrl(null);
      setPendingFile(null);
      setIsDirty(false);
      setSlugManuallyEdited(false);
      setEnabledLocales(["tr"]);
      setActiveLocale("tr");
      setTranslations({ tr: { ...EMPTY_LOCALE_DATA } });
      setForbiddenCountries([]);
    }
  }, [category?.id, mode]);

  // ── Resolve forbidden country codes → full objects when countries list loads
  useEffect(() => {
    if (!category || !countries.length) return;

    const resolved = category.forbiddenCountries
      .map((code) => countries.find((c) => c.code === code))
      .filter((c): c is CategoryCountry => !!c);

    setForbiddenCountries(resolved);
  }, [category?.id, countries]);

  // ── Derived form (always reflects activeLocale) ────────────────────────────
  const currentLocaleData = translations[activeLocale] ?? { ...EMPTY_LOCALE_DATA };
  const form: CategoryFormData = { slug, status, ...currentLocaleData };

  // ── Field handlers ─────────────────────────────────────────────────────────

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      if (name === "slug") {
        setSlugManuallyEdited(true);
        setSlug(generateSlug(value));
      } else if (name === "status") {
        setStatus(value as CATEGORY_STATUS);
      } else {
        setTranslations((prev) => {
          const current = prev[activeLocale] ?? { ...EMPTY_LOCALE_DATA };
          if (name === "name" && !slugManuallyEdited) {
            setSlug(generateSlug(value));
          }
          return { ...prev, [activeLocale]: { ...current, [name]: value } };
        });
      }

      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setIsDirty(true);
    },
    [activeLocale, slugManuallyEdited],
  );

  const handleSelect = useCallback(
    (name: keyof CategoryFormData, value: string) => {
      if (name === "slug") {
        setSlug(value);
      } else if (name === "status") {
        setStatus(value as CATEGORY_STATUS);
      } else {
        setTranslations((prev) => ({
          ...prev,
          [activeLocale]: { ...(prev[activeLocale] ?? EMPTY_LOCALE_DATA), [name]: value },
        }));
      }
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setIsDirty(true);
    },
    [activeLocale],
  );

  const handleFileChange = useCallback((file: File | null) => {
    setPendingFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImgUrl(objectUrl);
      // Image is shared — update imgUrl in all locales
      setTranslations((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((code) => {
          next[code] = { ...next[code], imgUrl: objectUrl };
        });
        return next;
      });
      setIsDirty(true);
    }
  }, []);

  const handleFaqsChange = useCallback(
    (updatedFaqs: CategoryFaq[]) => {
      setTranslations((prev) => ({
        ...prev,
        [activeLocale]: { ...(prev[activeLocale] ?? EMPTY_LOCALE_DATA), faq: updatedFaqs },
      }));
      setIsDirty(true);
    },
    [activeLocale],
  );

  // ── Locale handlers ────────────────────────────────────────────────────────

  const handleLocaleChange = useCallback((code: string) => {
    setActiveLocale(code);
    setErrors({});
  }, []);

  const handleLocaleAdd = useCallback((locale: Locale) => {
    setEnabledLocales((prev) =>
      prev.includes(locale.code) ? prev : [...prev, locale.code],
    );
    setTranslations((prev) => ({
      ...prev,
      [locale.code]: prev[locale.code] ?? { ...EMPTY_LOCALE_DATA },
    }));
    setActiveLocale(locale.code);
  }, []);

  const handleLocaleRemove = useCallback(
    (code: string) => {
      if (enabledLocales.length <= 1) return;
      setEnabledLocales((prev) => prev.filter((l) => l !== code));
      setTranslations((prev) => {
        const next = { ...prev };
        delete next[code];
        return next;
      });
      if (activeLocale === code) {
        setActiveLocale(enabledLocales.find((l) => l !== code) ?? "tr");
      }
    },
    [enabledLocales, activeLocale],
  );

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const t = translations[activeLocale] ?? EMPTY_LOCALE_DATA;
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};

    if (!t.name.trim())            newErrors.name            = "Kategori adı zorunludur.";
    if (!slug.trim())              newErrors.slug            = "URL zorunludur.";
    if (!t.metaTitle.trim())       newErrors.metaTitle       = "Meta title zorunludur.";
    if (!t.metaDescription.trim()) newErrors.metaDescription = "Meta description zorunludur.";
    if (!t.imgAlt.trim())          newErrors.imgAlt          = "Alt etiket zorunludur.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const save = async (onSuccess?: (category: Category) => void) => {
    if (!validate()) {
      toast.error("Hata", "Lütfen zorunlu alanları doldurun.");
      return;
    }

    setSaving(true);

    try {
      let finalImgUrl = imgUrl ?? "";
      if (pendingFile) {
        setUploading(true);
        try {
          const uploaded = await uploadService.uploadImage(pendingFile);
          finalImgUrl = uploaded.url;
        } finally {
          setUploading(false);
        }
      }

      // Build translations payload for all enabled locales
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const translationsPayload: Record<string, any> = {};
      enabledLocales.forEach((code) => {
        const t = translations[code] ?? EMPTY_LOCALE_DATA;
        translationsPayload[code] = {
          name: t.name,
          slug,
          description: t.description,
          metaTitle: t.metaTitle,
          metaDescription: t.metaDescription,
          imgAlt: t.imgAlt,
          imgUrl: finalImgUrl || t.imgUrl,
          faq: t.faq,
        };
      });

      let result: Category;

      if (mode === "edit" && category) {
        const payload: CategoryUpdatePayload = {
          slug,
          status,
          translations: translationsPayload,
        };
        const response = await categoryService.update(category.id, payload);
        result = response.category;
        toast.success("Güncellendi", `${translations[activeLocale]?.name} başarıyla güncellendi.`);
      } else {
        const payload: CategoryCreatePayload = {
          slug,
          status,
          translations: translationsPayload,
        };
        result = await categoryService.create(payload);
        toast.success(
          mode === "duplicate" ? "Kopyalandı" : "Oluşturuldu",
          `Kategori başarıyla ${mode === "duplicate" ? "kopyalandı" : "oluşturuldu"}.`,
        );
      }

      setIsDirty(false);
      setPendingFile(null);
      onSuccess?.(result);
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes("409") || message.includes("slug")) {
        setErrors((prev) => ({ ...prev, slug: "Bu URL zaten kullanılıyor." }));
        toast.error("Hata", "Bu URL zaten kullanılıyor.");
      } else {
        toast.error(
          "Hata",
          mode === "edit" ? "Kategori güncellenemedi." : "Kategori oluşturulamadı.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    await save((saved) => {
      router.push(`/epinpay/categories/${saved.id}`);
    });
  };

  // ── Return ─────────────────────────────────────────────────────────────────

  return {
    form,
    errors,
    saving,
    uploading,
    isDirty,
    imgUrl,
    activeLocale,
    enabledLocales,
    forbiddenCountries,
    setForbiddenCountries,
    setEnabledLocales,
    setActiveLocale,
    handleChange,
    handleSelect,
    handleFileChange,
    handleFaqsChange,
    handleLocaleChange,
    handleLocaleAdd,
    handleLocaleRemove,
    handleSave,
    save,
  };
}