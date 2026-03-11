"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, PRODUCT_STATUS } from "@/features/products/types";
import { productService } from "@/features/products/services/product.service";
import { toast } from "@/components/common/toast/toast";

export interface ProductFormData {
  // Genel
  name: string;
  slug: string;
  description: string;
  category_id: string;
  type: string;
  platform: string;
  region: string;
  status: PRODUCT_STATUS;
  // Fiyat
  basePrice: string;
  fakePrice: string;
  discountRate: string;
  spreadRate: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
}

const INITIAL_FORM: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  category_id: "",
  type: "",
  platform: "",
  region: "",
  status: PRODUCT_STATUS.DRAFT,
  basePrice: "",
  fakePrice: "",
  discountRate: "",
  spreadRate: "",
  metaTitle: "",
  metaDescription: "",
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

export function useProductForm(product: Product | null, mode: "create" | "edit" | "duplicate") {
  const [form, setForm] = useState<ProductFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (product) {
      const data: ProductFormData = {
        name: mode === "duplicate" ? `${product.translation.name} (Kopya)` : product.translation.name,
        slug: mode === "duplicate" ? `${product.translation.slug}-kopya` : product.translation.slug,
        description: product.translation.description,
        category_id: String(product.category_id),
        type: product.type,
        platform: product.platform,
        region: product.region,
        status: mode === "duplicate" ? PRODUCT_STATUS.DRAFT : product.status,
        basePrice: String(product.basePrice ?? ""),
        fakePrice: String(product.fakePrice ?? ""),
        discountRate: String(product.discountRate ?? ""),
        spreadRate: String(product.spreadRate ?? ""),
        metaTitle: product.translation.metaTitle,
        metaDescription: product.translation.metaDescription,
      };
      setForm(data);
      setIsDirty(false);
      setSlugManuallyEdited(false);
    } else {
      setForm(INITIAL_FORM);
    }
  }, [product, mode]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => {
        const next = { ...prev, [name]: value };
        // Slug otomatik güncelleme
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

  const handleSelect = useCallback((name: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setIsDirty(true);
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Ürün adı zorunludur.";
    if (!form.slug.trim()) newErrors.slug = "URL/Slug zorunludur.";
    if (!form.category_id) newErrors.category_id = "Kategori seçilmelidir.";
    if (!form.basePrice) newErrors.basePrice = "Fiyat zorunludur.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async (onSuccess?: (product: Product) => void) => {
    if (!validate()) {
      toast.error("Hata", "Lütfen zorunlu alanları doldurun.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        category_id: Number(form.category_id),
        type: form.type,
        platform: form.platform,
        region: form.region,
        status: form.status,
        basePrice: Number(form.basePrice),
        fakePrice: form.fakePrice ? Number(form.fakePrice) : null,
        discountRate: Number(form.discountRate),
        spreadRate: form.spreadRate ? Number(form.spreadRate) : null,
        translation: {
            ...(product?.translation ?? {}),
            name: form.name,
            slug: form.slug,
            description: form.description,
            metaTitle: form.metaTitle,
            metaDescription: form.metaDescription,
        },
        } as Partial<Product>;

      let result: Product;
      if (mode === "edit" && product) {
        result = await productService.update(product.id, payload);
        toast.success("Güncellendi", `${form.name} başarıyla güncellendi.`);
      } else {
        result = await productService.create(payload);
        toast.success("Oluşturuldu", `${form.name} başarıyla oluşturuldu.`);
      }
      setIsDirty(false);
      onSuccess?.(result);
    } catch {
      toast.error("Hata", mode === "edit" ? "Ürün güncellenemedi." : "Ürün oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    errors,
    saving,
    isDirty,
    handleChange,
    handleSelect,
    save,
  };
}