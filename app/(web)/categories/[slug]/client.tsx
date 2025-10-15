"use client";

import { ProductItem } from "@/components//web/product-item";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { TProduct } from "@/db/schema";
import { BorderedGrid } from "@/components/web/bordered-grid";

export function Client({ products }: { products: TProduct[] }) {
  const [sort] = useQueryState("sort");
  const [selectedMaterials] = useQueryState("materials");
  const [selectedGenders] = useQueryState("genders");
  const [priceMin] = useQueryState("priceMin");
  const [priceMax] = useQueryState("priceMax");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Apply material filter
    if (selectedMaterials) {
      const materialsArray = selectedMaterials.split(",");
      filtered = filtered.filter(
        (product) =>
          product.material && materialsArray.includes(product.material)
      );
    }

    // Apply gender filter
    if (selectedGenders) {
      const gendersArray = selectedGenders.split(",");
      filtered = filtered.filter(
        (product) => product.gender && gendersArray.includes(product.gender)
      );
    }

    // Apply price range filter
    if (priceMin !== null || priceMax !== null) {
      filtered = filtered.filter((product) => {
        const price = product.price; // Prices are already in whole numbers
        const min = priceMin ? parseInt(priceMin.toString()) : 0;
        const max = priceMax ? parseInt(priceMax.toString()) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return a.price - b.price;
      }
    });
  }, [products, sort, selectedMaterials, selectedGenders, priceMin, priceMax]);

  return (
    <div className="transition-all duration-300 ease-in-out">
      <BorderedGrid>
        {filteredAndSortedProducts.map((product) => (
          <Link
            href={`/products/${product.slug}`}
            key={product.id}
            prefetch={false}
          >
            <ProductItem product={product} carousel />
          </Link>
        ))}
      </BorderedGrid>
      {filteredAndSortedProducts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No products found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}
