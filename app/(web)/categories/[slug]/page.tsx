import { notFound } from "next/navigation";
import React from "react";
import { H2 } from "@/components/ui/typography";
import { Client } from "./client";
import { Filter } from "./filter";
import { Sort } from "./sort";
import { getCategory } from "@/lib/queries";

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
  }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const category = await getCategory(slug);

  if (!category) notFound();

  const products = category?.products;
  const uniqueMaterials = Array.from(
    new Set(products.map((p) => p.material).filter(Boolean))
  ) as string[];

  const uniqueGenders = Array.from(
    new Set(products.map((p) => p.gender).filter(Boolean))
  ) as string[];

  // Calculate price range from filtered results
  const prices = products.map((p) => p.price);
  const priceRange = {
    min: prices.length > 0 ? Math.floor(Math.min(...prices)) : 0,
    max: prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000,
  };

  return (
    <div className="py-18">
      {/* Header Section with consistent border pattern */}
      <section>
        <div className="border-y py-8 px-4">
          <div className="flex items-center justify-between">
            <div className="text-left flex-1">
              <H2>{category?.title}</H2>
              <p className="text-muted-foreground max-w-prose text-pretty mt-2">
                {category?.description}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <React.Suspense>
                <Filter
                  materials={uniqueMaterials}
                  genders={uniqueGenders}
                  priceRange={priceRange}
                />
                <Sort />
              </React.Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="border-b pb-12">
        <React.Suspense>
          <Client products={products} key={sort} />
        </React.Suspense>
      </section>
    </div>
  );
}
