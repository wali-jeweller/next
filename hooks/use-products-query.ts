"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ProductsQueryParams, ProductsResponse } from "@/lib/products-api";

async function fetchProducts(
  params: ProductsQueryParams
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const response = await fetch(`/api/products?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export function useProductsQuery(params: ProductsQueryParams) {
  return useSuspenseQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
