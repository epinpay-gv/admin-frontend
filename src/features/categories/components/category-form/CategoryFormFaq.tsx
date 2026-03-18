"use client";

import { CategoryFaq } from "@/features/categories/types";
import FaqFormSection from "@/components/common/faq/FaqFormSecion"; 

interface CategoryFormFaqProps {
  faqs: CategoryFaq[];
  onChange: (faqs: CategoryFaq[]) => void;
}

export default function CategoryFormFaq({
  faqs,
  onChange,
}: CategoryFormFaqProps) {
  return (
    <div className="category-faq-wrapper">
      <FaqFormSection<CategoryFaq> 
        faqs={faqs} 
        onChange={onChange} 
      />
    </div>
  );
}