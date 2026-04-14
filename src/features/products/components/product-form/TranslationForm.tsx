"use client";
import FormGroupContainer from "@/components/common/container/FormGroupContainer";
import FaqFormSection from "@/components/common/faq/FaqFormSecion";
import Input from "@/components/common/input/Input";
import { CategoryFaq } from "@/features/categories/types";
import { ProductFormData } from "../../hooks/useProductForm";
import DescriptionForm from "./DescriptionForm";

interface TranslationFormProps {
  form: ProductFormData;
  errors: Partial<Record<keyof ProductFormData, string>>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleFaqsChange: (faqs: CategoryFaq[]) => void;
}

export default function TranslationForm({
  form,
  errors,
  onChange,
  handleFaqsChange,
}: TranslationFormProps) {
  const titleLength = form.metaTitle.length;
  const descLength = form.metaDescription.length;

  return (
    <div className="space-y-8">
      {/* META TITLE */}
      <FormGroupContainer
        title="Meta Title"
        titleLength={titleLength}
        maxTitleLength={60}
        formArea={
          <Input
            name="metaTitle"
            value={form.metaTitle}
            onChange={onChange}
            error={errors.metaTitle}
            placeholder="Kategori başlığı — Site Adı"
            state={titleLength > 60 ? "error" : "default"}
          />
        }
      />

      {/* META DESC */}
      <FormGroupContainer
        title="Meta Description"
        titleLength={descLength}
        maxTitleLength={160}
        formArea={
          <Input
            name="metaDescription"
            value={form.metaDescription}
            onChange={onChange}
            error={errors.metaDescription}
            placeholder="Kategori meta açıklaması..."
            state={descLength > 160 ? "error" : "default"}
          />
        }
      />

      {/* AÇIKLAMA — collapsible */}
      <FormGroupContainer
        title="Kategori Açıklaması"
        formArea={
          <DescriptionForm
            form={form}
            onChange={onChange}
          />
        }
      />

      {/* FAQ */}
      <FormGroupContainer
        title="Sık Sorulan Sorular"
        formArea={
          <FaqFormSection faqs={form.faq} onChange={handleFaqsChange} />
        }
      />
    </div>
  );
}
