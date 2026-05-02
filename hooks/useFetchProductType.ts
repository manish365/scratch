import { useEffect } from "react";
import { CategoryType } from "../types/General";

export function useFetchProductType(categories: CategoryType[]) {
  useEffect(() => {
    if (categories.length) {
      // todo
    }
  }, [categories]);
}