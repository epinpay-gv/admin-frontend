"use client";
import { useState } from "react";
import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";
import RichTextEditor from "@/components/common/rich-text/RichTextEditor";

interface DescriptionFormProps {
  form: CategoryFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export default function DescriptionForm({
  form,
  onChange,
}: DescriptionFormProps) {
  const [descExpanded, setDescExpanded] = useState(false);

  const handleDescriptionChange = (html: string) => {
    onChange({
      target: { name: "description", value: html },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <div>
      <div
        className={[
          "overflow-hidden transition-all duration-300 ease-in-out",
          descExpanded ? "" : "max-h-56",
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
  );
}
