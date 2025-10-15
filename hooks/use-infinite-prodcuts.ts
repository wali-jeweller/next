"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

interface Product {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  price: number;
  discountedPrice: number;
  status: string;
  visibility: string;
  material: "gold" | "silver" | "platinum" | "other";
  weight: number | null;
  gender: string | null;
  metadata: unknown;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  images: Array<{
    id: string;
    url: string;
    key: string | null;
    rank: number;
    metadata: unknown;
    productId: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  }>;
}

interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  page: number;
}

interface UseInfiniteProductsParams {
  limit?: number;
  sort?: string;
  materials?: string;
  genders?: string;
  priceMin?: string;
  priceMax?: string;
}

export function useInfiniteProducts(params: UseInfiniteProductsParams = {}) {
  const { limit = 12, sort, materials, genders, priceMin, priceMax } = params;

  return useInfiniteQuery({
    queryKey: [
      "products",
      { limit, sort, materials, genders, priceMin, priceMax },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          page: pageParam.toString(),
          limit: limit.toString(),
        }),
      });

      return result as unknown as ProductsResponse;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    select: (data) => {
      // Remove duplicates across all pages
      const seenIds = new Set<string>();
      const uniquePages = data.pages.map((page) => ({
        ...page,
        products: page.products.filter((product) => {
          if (seenIds.has(product.id)) {
            return false;
          }
          seenIds.add(product.id);
          return true;
        }),
      }));

      return {
        ...data,
        pages: uniquePages,
      };
    },
  });
}
