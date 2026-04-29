import { useEffect, useState } from "react";
import { categoryService } from "@/features/categories/services/category.service";

export function useCategories() {
  const [options, setOptions] = useState<{ label: string; value: string; status: string; }[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const allCategories = [];
      let page = 1;
      const limit = 20;

      while (true) {
        const res = await categoryService.getAll({ page, limit });
        allCategories.push(...res.categories);

        if (allCategories.length >= res.pagination.total) break;
        page++;
      }

      setOptions(
        allCategories.map((c) => ({
          label: c.translations?.tr?.name ?? "",
          value: String(c.id),
          status: c.status,
        })),
      );
    };

    fetchAll();
  }, []);

  return options;
}