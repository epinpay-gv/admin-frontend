"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, PRODUCT_STATUS } from "@/features/products/types";
import { productService } from "@/features/products/services/product.service";
import { uploadService } from "@/features/products/services/upload.service";
import { toast } from "@/components/common/toast/toast";

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
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
  metaTitle: string;
  metaDescription: string;
  imgAlt: string;
}

const INITIAL_FORM: ProductFormData = {
  name: "",
  slug: "",
  description: "",
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
  metaTitle: "",
  metaDescription: "",
  imgAlt: "",
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

export function useProductForm(
  product: Product | null,
  mode: "create" | "edit" | "duplicate"
) {
  const [form, setForm] = useState<ProductFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setForm({
        name:
          mode === "duplicate"
            ? `${product.translation.name} (Kopya)`
            : product.translation.name,
        slug:
          mode === "duplicate"
            ? `${product.translation.slug}-kopya`
            : product.translation.slug,
        description: product.translation.description,
        category_id: String(product.category_id),
        type: String(product.type),
        type_id: String(product.type_id),
        platform: String(product.platform),
        platform_id: String(product.platform_id),
        region: String(product.region),
        region_id: String(product.region_id),
        status: mode === "duplicate" ? PRODUCT_STATUS.DRAFT : product.status,
        basePrice: String(product.basePrice ?? ""),
        fakePrice: String(product.fakePrice ?? ""),
        discountRate: String(product.discountRate ?? ""),
        spreadRate: String(product.spreadRate ?? ""),
        metaTitle: product.translation.metaTitle,
        metaDescription: product.translation.metaDescription,
        imgAlt: product.translation.imgAlt ?? "",
      });
      setImgUrl(product.translation.imgUrl ?? null);
      setIsDirty(false);
      setSlugManuallyEdited(false);
      setPendingFile(null);
    } else {
      setForm(INITIAL_FORM);
      setImgUrl(null);
      setPendingFile(null);
    }
  }, [product, mode]);

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
    (name: keyof ProductFormData, value: string) => {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      setIsDirty(true);
    },
    []
  );

  const handleFileChange = useCallback((file: File | null) => {
    setPendingFile(file);
    if (file) {
      setImgUrl(URL.createObjectURL(file));
      setIsDirty(true);
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Ürün adı zorunludur.";
    if (!form.slug.trim()) newErrors.slug = "URL/Slug zorunludur.";
    if (!form.category_id) newErrors.category_id = "Kategori seçilmelidir.";
    if (!form.basePrice) newErrors.basePrice = "Fiyat zorunludur.";
    if (!form.imgAlt.trim()) newErrors.imgAlt = "Alt etiket zorunludur.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async (
    onSuccess?: (product: Product) => void,
    locale: string = "en"
  ) => {
    if (!validate()) {
      toast.error("Hata", "Lütfen zorunlu alanları doldurun.");
      return;
    }

    setSaving(true);
    try {
      let finalImgUrl = imgUrl ?? product?.translation.imgUrl ?? "";

      if (pendingFile) {
        setUploading(true);
        try {
          const uploaded = await uploadService.uploadImage(pendingFile);
          finalImgUrl = uploaded.url;
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        category_id: Number(form.category_id),
        type: form.type,
        type_id: Number(form.type_id),
        platform: form.platform,
        platform_id: Number(form.platform_id),
        region: form.region,
        region_id: Number(form.region_id),
        status: form.status,
        basePrice: Number(form.basePrice),
        fakePrice: form.fakePrice ? Number(form.fakePrice) : null,
        discountRate: Number(form.discountRate),
        spreadRate: form.spreadRate ? Number(form.spreadRate) : null,
        translation: {
          ...(product?.translation ?? {}),
          locale,
          name: form.name,
          slug: form.slug,
          description: form.description,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          imgAlt: form.imgAlt,
          imgUrl: finalImgUrl,
        },
      } as Partial<Product>;

      let result: Product;
      if (mode === "edit" && product) {
        result = await productService.update(product.id, payload, locale);
        toast.success("Güncellendi", `${form.name} başarıyla güncellendi.`);
      } else {
        result = await productService.create({ ...payload, locale } as Partial<Product>);
        toast.success("Oluşturuldu", `${form.name} başarıyla oluşturuldu.`);
      }

      setIsDirty(false);
      setPendingFile(null);
      onSuccess?.(result);
    } catch {
      toast.error(
        "Hata",
        mode === "edit" ? "Ürün güncellenemedi." : "Ürün oluşturulamadı."
      );
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
    handleChange,
    handleSelect,
    handleFileChange,
    save,
  };
}