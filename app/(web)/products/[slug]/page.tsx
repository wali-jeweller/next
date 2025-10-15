/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { notFound } from "next/navigation";
import React from "react";
import { ProductCarousel } from "@/components/web/product-carousel";
import { CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ImageCarousel } from "./_components/image-carousel";
import { ImageSection } from "./_components/image-section";
import { ProductDetails } from "./_components/product-details";
import { ProductCart } from "./_components/product-cart";
import { db } from "@/db";

const getProduct = async (slug: string) => {
  "use cache";
  const product = await db.query.products.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
    with: {
      category: {
        columns: {
          id: true,
          title: true,
          sizes: true,
        },
      },
    },
  });
  return product;
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="py-18">
      {/* Product Details Section */}
      <section className="border-b pb-12">
        <div className="flex w-full flex-col lg:flex-row px-4">
          <div className={cn("w-full space-y-2 lg:w-7/12")}>
            <ImageSection images={product.images} />
            <ImageCarousel images={product.images} />
          </div>

          <div
            className={cn(
              "mx-auto mt-8 lg:mt-0 lg:w-5/12 lg:max-w-xl lg:px-16"
            )}
          >
            <ProductDetails product={product} />
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t p-4 lg:hidden">
        <ProductCart
          product={product}
          categorySizes={product.category?.sizes || []}
        />
      </div>

      {/* Similar Products Section */}
      <section className="border-b pb-12">
        <div className="border-b py-12">
          <h2 className="text-center text-2xl font-medium">Similar Products</h2>
        </div>
        <div className="px-4 py-8">
          <React.Suspense fallback={<SimilarProductsSkeleton />}>
            {/* <SimilarProducts product={product} /> */}
          </React.Suspense>
        </div>
      </section>
    </div>
  );
}

function SimilarProductsSkeleton() {
  return (
    <div className="px-4">
      <ProductCarousel>
        {Array.from({ length: 10 }).map((_, i) => (
          <CarouselItem
            key={i}
            className="flex flex-col gap-2 md:basis-1/3 md:first:-ml-0 lg:basis-1/4 xl:basis-1/5"
          >
            <div className="aspect-square h-full w-full bg-muted animate-pulse" />
            <div className="h-4 w-full bg-muted animate-pulse" />
            <div className="h-4 w-24 bg-muted animate-pulse" />
          </CarouselItem>
        ))}
      </ProductCarousel>
    </div>
  );
}
