import { useEffect, useState } from "react";
import { categoryService } from "@/features/categories/services/category.service";

export function useCategories() {
  const [options, setOptions] = useState<{ label: string; value: string; status: string; }[]>([]);

  useEffect(() => {
    categoryService.getAll({ limit: 1000 }).then((res) => {
      setOptions(
        res.categories.map((c) => ({
          label: c.translations?.tr?.name ?? "", 
          value: String(c.id),
          status: c.status
        })),
      );
    });
  }, []);

  return options;
}