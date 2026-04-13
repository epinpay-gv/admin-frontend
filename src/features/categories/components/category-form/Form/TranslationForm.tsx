"use client";
import { useState } from "react";
import FormGroupContainer from "@/components/common/container/FormGroupContainer";
import FaqFormSection from "@/components/common/faq/FaqFormSecion";
import Input from "@/components/common/input/Input";
import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";
import { CategoryFaq } from "@/features/categories/types";
import RichTextEditor from "@/components/common/rich-text/RichTextEditor";

interface TranslationFormProps {
  form: CategoryFormData;
  errors: Partial<Record<keyof CategoryFormData, string>>;
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

  // ── Collapsible description state ─────────────────────────────────────────
  const [descExpanded, setDescExpanded] = useState(false);

  const handleDescriptionChange = (html: string) => {
    onChange({
      target: { name: "description", value: html },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

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
          <div>
            {/* Collapsed preview / expanded editor */}
            <div
              className={[
                "overflow-hidden transition-all duration-300 ease-in-out",
                descExpanded ? "max-h-500" : "max-h-32",
              ].join(" ")}
            >
              <RichTextEditor
                value={form.description}
                onChange={handleDescriptionChange}
                placeholder="Kategori açıklaması..."
              />
            </div>

            {/* Toggle button */}
            <button
              type="button"
              onClick={() => setDescExpanded((prev) => !prev)}
              className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-gray-400
                         hover:text-gray-200 transition-colors duration-150 select-none"
            >
              {descExpanded ? "Daha az göster" : "Daha fazla göster"}
            </button>
          </div>
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
