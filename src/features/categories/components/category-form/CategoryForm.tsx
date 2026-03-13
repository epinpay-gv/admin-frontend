"use client";

import { Category, CategoryCountry } from "@/features/categories/types";
import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";
import { CategoryFaq } from "@/features/categories/types";
import CategoryFormGeneral from "./CategoryFormGeneral";
import CategoryFormSeo from "./CategoryFormSeo";
import CategoryFormMedia from "./CategoryFormMedia";
import CategoryFormGenres from "./CategoryFormGenres";
import CategoryFormContent from "./CategoryFormContent";
import CategoryFormFaq from "./CategoryFormFaq";
import CategoryFormCountries from "./CategoryFormCountries";

interface CategoryFormProps {
  product: Category | null;
  mode: "create" | "edit" | "duplicate";
  saving: boolean;
  form: CategoryFormData;
  errors: Partial<Record<keyof CategoryFormData, string>>;
  imgUrl: string | null;
  faqs: CategoryFaq[];
  forbiddenCountries: CategoryCountry[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelect: (name: keyof CategoryFormData, value: string) => void;
  handleGenresChange: (genres: string[]) => void;
  handleFileChange: (file: File | null) => void;
  handleFaqsChange: (faqs: CategoryFaq[]) => void;
  handleForbiddenCountriesChange: (countries: CategoryCountry[]) => void;
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      <span
        className="text-[12px] font-semibold uppercase tracking-widest font-mono whitespace-nowrap"
        style={{ color: "var(--text-heading)" }}
      >
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

export default function CategoryForm({
  form,
  errors,
  imgUrl,
  faqs,
  forbiddenCountries,
  handleChange,
  handleSelect,
  handleGenresChange,
  handleFileChange,
  handleFaqsChange,
  handleForbiddenCountriesChange,
}: CategoryFormProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sol: Formlar */}
      <div className="lg:col-span-2 pt-6 space-y-6">

        {/* Genel Bilgiler */}
        <div
          className="rounded-xl border p-6"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <SectionDivider title="Genel Bilgiler" />
          <div className="mt-4">
            <CategoryFormGeneral
              form={form}
              errors={errors}
              onChange={handleChange}
              onSelect={handleSelect}
            />
          </div>
        </div>

        {/* SEO */}
        <div
          className="rounded-xl border p-6"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <SectionDivider title="SEO" />
          <div className="mt-4">
            <CategoryFormSeo
              form={form}
              errors={errors}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Genre Tagleri */}
        <div
          className="rounded-xl border p-6"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <SectionDivider title="Genre Tagleri" />
          <div className="mt-4">
            <CategoryFormGenres
              genres={form.genres}
              onChange={handleGenresChange}
            />
          </div>
        </div>

        {/* Kategori İçeriği */}
        <div
          className="rounded-xl border p-6"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <SectionDivider title="Kategori İçeriği" />
          <div className="mt-4">
            <CategoryFormContent form={form} onChange={handleChange} />
          </div>
        </div>

        {/* Ülke Kısıtlamaları */}
        <div
          className="rounded-xl border p-6"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <SectionDivider title="Ülke Kısıtlamaları" />
          <div className="mt-4">
            <CategoryFormCountries
              forbidden={forbiddenCountries}
              onChange={handleForbiddenCountriesChange}
            />
          </div>
        </div>

        {/* SSS */}
        <div
          className="rounded-xl border p-6"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <SectionDivider title="Sıkça Sorulan Sorular" />
          <div className="mt-4">
            <CategoryFormFaq faqs={faqs} onChange={handleFaqsChange} />
          </div>
        </div>
      </div>

      {/* Sağ: Medya */}
      <div className="space-y-4 pt-6">
        <div
          className="rounded-xl border p-6 sticky top-6"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <SectionDivider title="Medya" />
          <div className="mt-4">
            <CategoryFormMedia
              imgUrl={imgUrl}
              form={form}
              errors={errors}
              onChange={handleChange}
              onFileChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}