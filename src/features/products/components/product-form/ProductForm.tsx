"use client";
import { Suspense } from "react";
import { useProductForm } from "@/features/products/hooks/useProductForm";
import FormSectionContainer from "@/components/common/container/FormSectionContainer";
import GeneralInfoForm from "./GeneralInfoForm";
import PricingForm from "./PricingForm";
import TranslationForm from "./TranslationForm";
import { CategoryCountry, CategoryFaq } from "@/features/categories";
import CountryRestrictionForm from "./CountryRestrictionForm";
import MediaForm from "./MediaForm";

interface ProductFormProps {
  form: ReturnType<typeof useProductForm>["form"];
  errors: ReturnType<typeof useProductForm>["errors"];
  forbiddenCountries: CategoryCountry[];
  imgUrl: string | null;
  uploading?: boolean;
  types: ReturnType<typeof useProductForm>["types"];
  platforms: ReturnType<typeof useProductForm>["platforms"];
  regions: ReturnType<typeof useProductForm>["regions"];
  categories: ReturnType<typeof useProductForm>["categories"];
  metaLoading: boolean;
  handleFileChange: (file: File | null) => void;
  handleChange: ReturnType<typeof useProductForm>["handleChange"];
  handleSelect: ReturnType<typeof useProductForm>["handleSelect"];
  handleFaqsChange: (faqs: CategoryFaq[]) => void;
  handleForbiddenCountriesChange: (countries: CategoryCountry[]) => void;
}

export default function ProductForm({
  form,
  errors,
  forbiddenCountries,
  imgUrl,
  uploading,
  types,
  platforms,
  regions,
  categories,
  metaLoading,
  handleFileChange,
  handleChange,
  handleSelect,
  handleFaqsChange,
  handleForbiddenCountriesChange,
}: ProductFormProps) {
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
              types={types}
              platforms={platforms}
              regions={regions}
              categories={categories}
              metaLoading={metaLoading}
              onChange={handleChange}
              onSelect={handleSelect}
            />
          }
        />
        {/* Fiyatlandırma */}
        <FormSectionContainer
          title="Fiyatlandırma"
          content={
            <PricingForm form={form} errors={errors} onChange={handleChange} />
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
                uploading={uploading}
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
