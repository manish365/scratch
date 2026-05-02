import { useEffect, useState } from "react"
import { CategoryType } from "../types/General"

export default function useProductCategories(
  selectedCategories: string[],
  allCategories: CategoryType[]
): string[] {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    if (selectedCategories?.length && allCategories?.length) {
      const cat: CategoryType[] = [];
      allCategories.map((c) => {
        if (selectedCategories.includes(c._id)) {
          cat.push(c);
        }
      });
      setCategories(cat);
    }
  }, [selectedCategories, allCategories, setCategories]);
  return categories.map(c => c.name);
}
