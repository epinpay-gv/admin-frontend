"use client";
import {
  Category,
  CategoryCountry,
  CategoryFaq,
} from "@/features/categories/types";
import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";
import { Suspense } from "react";
import FormSectionContainer from "@/components/common/container/FormSectionContainer";
import CountryRestrictionForm from "./CountryRestrictionForm";
import GeneralInfoForm from "./GeneralInfoForm";
import MediaForm from "./MediaForm";
import TranslationForm from "./TranslationForm";

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
  handleFileChange,
  handleFaqsChange,
  handleForbiddenCountriesChange,
}: CategoryFormProps) {
  return (
    <div className="md:flex w-full gap-6 pt-6 pb-10">
      {/* Sol: Formlar */}
      <div className="lg:flex-2 space-y-6">
        {/* Genel Bilgiler */}
        <FormSectionContainer
          title="Genel Bilgiler"
          content={
            <GeneralInfoForm
              form={form}
              errors={errors}
              onChange={handleChange}
            />
          }
        />

        {/* Dile Göre İçerik */}
        <FormSectionContainer
          title="Dile Göre İçerik"
          content={
            <TranslationForm
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
            <CountryRestrictionForm
              forbidden={forbiddenCountries}
              onChange={handleForbiddenCountriesChange}
            />
          }
        />
      </div>

      {/* Sağ: Medya */}
      <div className="flex-1">
        <Suspense fallback={null}>
          <FormSectionContainer
            title="Medya"
            content={
              <MediaForm
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
    </div>
  );
}
