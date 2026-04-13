"use client";
import {
  Category,
  CategoryCountry,
  CategoryFaq,
} from "@/features/categories/types";
import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";
import CategoryFormGeneral from "./CategoryFormGeneral";
import CategoryFormSeo from "./CategoryFormSeo";
import CategoryFormMedia from "./CategoryFormMedia";
import CategoryFormCountries from "./CategoryFormCountries";
import { Suspense } from "react";
import FormSectionContainer from "@/components/common/container/FormSectionContainer";
interface CategoryFormProps {
  product: Category | null;
  mode: "create" | "edit" | "duplicate";
  saving: boolean;
  form: CategoryFormData;
  errors: Partial<Record<keyof CategoryFormData, string>>;
  imgUrl: string | null;
  forbiddenCountries: CategoryCountry[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSelect: (name: keyof CategoryFormData, value: string) => void;
  handleFileChange: (file: File | null) => void;
  handleFaqsChange: (faqs: CategoryFaq[]) => void;
  handleForbiddenCountriesChange: (countries: CategoryCountry[]) => void;
}

export default function CategoryForm({
  form,
  errors,
  imgUrl,
  forbiddenCountries,
  handleChange,
  handleSelect,
  handleFileChange,
  handleFaqsChange,
  handleForbiddenCountriesChange,
}: CategoryFormProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 pb-10">
      {/* Sol: Formlar */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Genel Bilgiler */}
        <FormSectionContainer
          title="Genel Bilgiler"
          content={
            <CategoryFormGeneral
              form={form}
              errors={errors}
              onChange={handleChange}
              onSelect={handleSelect}
            />
          }
        />

        {/* Dile Göre İçerik */}
        <FormSectionContainer
          title="Dile Göre İçerik"
          content={
            <CategoryFormSeo
              form={form}
              errors={errors}
              onChange={handleChange}
              handleFaqsChange={handleFaqsChange}
            />
          }
        />

        {/* Ülke Kısıtlamaları */}
        <FormSectionContainer
          title="Ülke Kısıtlamaları"
          content={
            <CategoryFormCountries
              forbidden={forbiddenCountries}
              onChange={handleForbiddenCountriesChange}
            />
          }
        />
      </div>

      {/* Sağ: Medya */}
      <Suspense fallback={null}>
          <FormSectionContainer
            title="Medya"
            content={
              <CategoryFormMedia
                imgUrl={imgUrl}
                form={form}
                errors={errors}
                onChange={handleChange}
                onFileChange={handleFileChange}
              />
            }
          />
      </Suspense>
    </div>
  );
}
