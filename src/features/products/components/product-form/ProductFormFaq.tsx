"use client";

import { useState } from "react";
import { useProductFaq } from "@/features/products/hooks/useProductFaq";
import { ProductFaq } from "@/features/products/types";
import FaqFormSection from "@/components/common/faq/FaqFormSecion"; 

interface ProductFormFaqProps {
  initialFaqs?: ProductFaq[];
}

export default function ProductFormFaq({ initialFaqs = [] }: ProductFormFaqProps) {  
  const { faqs, setFaqs } = useProductFaq(initialFaqs);

  return (
    <div className="product-faq-container">      
      <FaqFormSection<ProductFaq> 
        faqs={faqs} 
        onChange={setFaqs} 
      />
    </div>
  );
}