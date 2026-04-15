"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, PRODUCT_STATUS } from "@/features/products/types";
import { productService } from "@/features/products/services/product.service";
import { uploadService } from "@/features/products/services/upload.service";
import { toast } from "@/components/common/toast/toast";
import { CategoryCountry, CategoryFaq } from "@/features/categories";
import { generateSlug } from "@/features/categories/utils";
import { useRouter } from "next/navigation";
import {
  productMetaService,
  ProductMeta,
} from "@/features/products/services/product-meta.service";
import { Locale } from "@/components/common/locale-selector/hooks/useLocale";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LocaleFormData {
  name: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  imgAlt: string;
  imgUrl: string;
  faq: CategoryFaq[];
}

export interface SharedFormData {
  slug: string;
  category_id: string;
  type: string;
  type_id: string;
  platform: string;
  platform_id: string;
  region: string;
  region_id: string;
  status: PRODUCT_STATUS;
  basePrice: string;
  fakePrice: string;
  discountRate: string;
  spreadRate: string;
}

export type ProductFormData = SharedFormData & LocaleFormData;

const EMPTY_LOCALE_DATA: LocaleFormData = {
  name: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  imgAlt: "",
  imgUrl: "",
  faq: [],
};

const INITIAL_SHARED: SharedFormData = {
  slug: "",
  category_id: "",
  type: "",
  type_id: "",
  platform: "",
  platform_id: "",
  region: "",
  region_id: "",
  status: PRODUCT_STATUS.DRAFT,
  basePrice: "",
  fakePrice: "",
  discountRate: "",
  spreadRate: "",
};

export function useProductForm(
  product: Product | null,
  mode: "create" | "edit" | "duplicate",
) {
  const router = useRouter();

  // ── Shared state ──────────────────────────────────────────────────────────
  const [shared, setShared] = useState<SharedFormData>(INITIAL_SHARED);

  // ── Per-locale translations map ───────────────────────────────────────────
  const [translations, setTranslations] = useState<Record<string, LocaleFormData>>({
    tr: { ...EMPTY_LOCALE_DATA },
  });

  // ── Locale state ──────────────────────────────────────────────────────────
  const [activeLocale, setActiveLocale] = useState("tr");
  const [enabledLocales, setEnabledLocales] = useState<string[]>(["tr"]);

  // ── Other state ───────────────────────────────────────────────────────────
  const [forbiddenCountries, setForbiddenCountries] = useState<CategoryCountry[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // imgUrl: CDN URL or blob preview — used only for <img> display, never sent to backend
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  // pendingFile: actual File waiting to be uploaded on save
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // ── Product meta (types, platforms, regions, categories) ──────────────────
  const [meta, setMeta] = useState<ProductMeta>({
    types: [],
    platforms: [],
    regions: [],
    categories: [],
  });
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);

  useEffect(() => {
    productMetaService
      .getAll()
      .then(setMeta)
      .catch((err: Error) => setMetaError(err.message))
      .finally(() => setMetaLoading(false));
  }, []);

  // ── Populate forbidden countries directly from product ────────────────────
  useEffect(() => {
    if (!product) return;
    setForbiddenCountries(product.forbiddenCountries ?? []);
  }, [product?.id]);

  // ── Populate from product ─────────────────────────────────────────────────
  useEffect(() => {
    if (product) {
      setShared({
        slug: mode === "duplicate"
          ? `${product.translation.slug}-kopya`
          : product.translation.slug,
        category_id: String(product.categoryId ?? ""),
        type: product.type ?? "",
        type_id: String(product.typeId ?? ""),
        platform: product.platform ?? "",
        platform_id: String(product.platformId ?? ""),
        region: product.region ?? "",
        region_id: String(product.regionId ?? ""),
        status: mode === "duplicate" ? PRODUCT_STATUS.DRAFT : product.status,
        basePrice: String(product.basePrice ?? ""),
        fakePrice: String(product.fakePrice ?? ""),
        discountRate: String(product.discountRate ?? ""),
        spreadRate: String(product.spreadRate ?? ""),
      });

      // imgUrl state holds the full CDN URL for display (comes from the mapper)
      setImgUrl(product.translation.imgUrl ?? null);
      setIsDirty(false);
      setSlugManuallyEdited(false);
      setPendingFile(null);

      const locales = product.availableLocales?.length
        ? product.availableLocales
        : ["tr"];
      setEnabledLocales(locales);
      const preferred = locales.includes("tr") ? "tr" : locales[0];
      setActiveLocale(preferred);

      const initialTranslations: Record<string, LocaleFormData> = {};

      if (product.translations && Object.keys(product.translations).length > 0) {
        locales.forEach((code) => {
          const lt = product.translations![code];
          if (lt) {
            initialTranslations[code] = {
              name: mode === "duplicate" && code === preferred
                ? `${lt.name} (Kopya)`
                : lt.name,
              description: lt.description ?? "",
              metaTitle: lt.metaTitle ?? "",
              metaDescription: lt.metaDescription ?? "",
              imgAlt: lt.imgAlt ?? "",
              // Store the raw imageKey (R2 path) — NOT the CDN URL.
              // imgUrl state above is used for display; this is used for the save payload.
              imgUrl: lt.imgUrl ?? "",
              faq: lt.faq ?? [],
            };
          } else {
            initialTranslations[code] = { ...EMPTY_LOCALE_DATA };
          }
        });
      } else {
        locales.forEach((code) => {
          initialTranslations[code] = { ...EMPTY_LOCALE_DATA };
        });
        const seedLocale = product.translation.locale || preferred;
        initialTranslations[seedLocale] = {
          name: mode === "duplicate"
            ? `${product.translation.name} (Kopya)`
            : product.translation.name,
          description: product.translation.description ?? "",
          metaTitle: product.translation.metaTitle ?? "",
          metaDescription: product.translation.metaDescription ?? "",
          imgAlt: product.translation.imgAlt ?? "",
          imgUrl: product.translation.imgUrl ?? "",
          faq: product.translation.faq ?? [],
        };
      }

      setTranslations(initialTranslations);
    } else {
      setShared(INITIAL_SHARED);
      setTranslations({ tr: { ...EMPTY_LOCALE_DATA } });
      setImgUrl(null);
      setPendingFile(null);
      setIsDirty(false);
      setSlugManuallyEdited(false);
      setEnabledLocales(["tr"]);
      setActiveLocale("tr");
      setForbiddenCountries([]);
    }
  }, [product?.id, mode]);

  // ── Derived form (always reflects activeLocale) ───────────────────────────
  const currentLocaleData = translations[activeLocale] ?? { ...EMPTY_LOCALE_DATA };
  const form: ProductFormData = { ...shared, ...currentLocaleData };

  // ── Field handlers ────────────────────────────────────────────────────────

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      if (name in INITIAL_SHARED) {
        setShared((prev) => {
          const next = { ...prev, [name]: value };
          if (name === "slug") {
            setSlugManuallyEdited(true);
            next.slug = generateSlug(value);
          }
          return next;
        });
      } else {
        setTranslations((prev) => {
          const current = prev[activeLocale] ?? { ...EMPTY_LOCALE_DATA };
          if (name === "name" && !slugManuallyEdited) {
            setShared((s) => ({ ...s, slug: generateSlug(value) }));
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
    (name: keyof ProductFormData, value: string) => {
      if (name in INITIAL_SHARED) {
        setShared((prev) => ({ ...prev, [name]: value }));
      } else {
        setTranslations((prev) => ({
          ...prev,
          [activeLocale]: {
            ...(prev[activeLocale] ?? EMPTY_LOCALE_DATA),
            [name]: value,
          },
        }));
      }
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setIsDirty(true);
    },
    [activeLocale],
  );

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) {
      // User cleared the image
      setPendingFile(null);
      setImgUrl(null);
      setIsDirty(true);
      return;
    }
    // Store file for upload on save, set blob URL only for preview display
    setPendingFile(file);
    setImgUrl(URL.createObjectURL(file));
    setIsDirty(true);
    // Do NOT touch translations here — imgUrl in translations is only updated
    // after the real R2 upload succeeds (inside save())
  }, []);

  const handleFaqsChange = useCallback(
    (updatedFaqs: CategoryFaq[]) => {
      setTranslations((prev) => ({
        ...prev,
        [activeLocale]: {
          ...(prev[activeLocale] ?? EMPTY_LOCALE_DATA),
          faq: updatedFaqs,
        },
      }));
      setIsDirty(true);
    },
    [activeLocale],
  );

  // ── Locale handlers ───────────────────────────────────────────────────────

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

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const t = translations[activeLocale] ?? EMPTY_LOCALE_DATA;
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!t.name.trim()) newErrors.name = "Ürün adı zorunludur.";
    if (!shared.slug.trim()) newErrors.slug = "URL/Slug zorunludur.";
    if (!shared.category_id) newErrors.category_id = "Kategori seçilmelidir.";
    if (!shared.basePrice) newErrors.basePrice = "Fiyat zorunludur.";
    if (!t.imgAlt.trim()) newErrors.imgAlt = "Alt etiket zorunludur.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Save ──────────────────────────────────────────────────────────────────

  const save = async (onSuccess?: (product: Product) => void) => {
    if (!validate()) {
      toast.error("Hata", "Lütfen zorunlu alanları doldurun.");
      return;
    }

    setSaving(true);

    try {
      // ── Step 1: Upload pending file if any ──────────────────────────────
      // finalImgKey is the R2 imageKey (e.g. "/products/my-product-uuid.webp")
      // It is null if no new file was picked — existing translations keep their own imgUrl.
      let finalImgKey: string | null = null;

      if (pendingFile) {
        setUploading(true);
        try {
          const uploaded = await uploadService.uploadImage(pendingFile, "products");
          finalImgKey = uploaded.imageKey;
          // Update preview to the real CDN URL now that upload succeeded
          setImgUrl(uploaded.imageUrl);
        } finally {
          setUploading(false);
        }
      }

      // ── Step 2: Build translations payload ──────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const translationsPayload: Record<string, any> = {};
      enabledLocales.forEach((code) => {
        const t = translations[code] ?? EMPTY_LOCALE_DATA;
        translationsPayload[code] = {
          name: t.name,
          slug: shared.slug,
          description: t.description,
          metaTitle: t.metaTitle,
          metaDescription: t.metaDescription,
          imgAlt: t.imgAlt,
          // Use the freshly uploaded key if available; otherwise keep the
          // existing imageKey that was loaded from the server (never a blob URL).
          imgUrl: finalImgKey ?? t.imgUrl ?? "",
          faq: t.faq,
        };
      });

      // ── Step 3: Persist ─────────────────────────────────────────────────
      const payload = {
        categoryId: Number(shared.category_id),
        typeId: Number(shared.type_id),
        platformId: Number(shared.platform_id),
        regionId: Number(shared.region_id),
        slug: shared.slug,
        status: shared.status,
        basePrice: Number(shared.basePrice),
        fakePrice: shared.fakePrice ? Number(shared.fakePrice) : null,
        discountRate: Number(shared.discountRate),
        spreadRate: shared.spreadRate ? Number(shared.spreadRate) : null,
        translations: translationsPayload,
      } as Partial<Product>;

      let result: Product;

      if (mode === "edit" && product) {
        result = await productService.update(product.id, payload);
        toast.success(
          "Güncellendi",
          `${translations[activeLocale]?.name} başarıyla güncellendi.`,
        );
      } else {
        result = await productService.create(payload);
        toast.success(
          mode === "duplicate" ? "Kopyalandı" : "Oluşturuldu",
          `Ürün başarıyla ${mode === "duplicate" ? "kopyalandı" : "oluşturuldu"}.`,
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
          message || (mode === "edit" ? "Ürün güncellenemedi." : "Ürün oluşturulamadı."),
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    await save((saved) => {
      router.push(`/epinpay/products/${saved.id}`);
    });
  };

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
    types: meta.types,
    platforms: meta.platforms,
    regions: meta.regions,
    categories: meta.categories,
    metaLoading,
    metaError,
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