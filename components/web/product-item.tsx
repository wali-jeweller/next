"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Caption, Price } from "@/components/ui/typography";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  title: string | null;
  price: number | null;
  discountedPrice: number | null;
  images: { url: string; alt?: string; rank?: number }[] | null;
  slug: string;
};

export type ProductItemProps = React.ComponentProps<"div"> & {
  product: Product;
  carousel?: boolean;
};

export function ProductItem({
  product,
  className,
  carousel = false,
}: ProductItemProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [isHovered, setIsHovered] = useState(false);
  const hasMultipleImages = product.images && product.images.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    api?.scrollPrev();
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    api?.scrollNext();
  };

  return (
    <div
      className="group flex flex-col gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("relative aspect-square overflow-hidden", className)}>
        <div className="absolute top-1 right-1 z-20">
          <React.Suspense fallback={<WishlistSkeleton />}>
            {/* <ItemWishlist productId={product.id} /> */}
          </React.Suspense>
        </div>

        {carousel && hasMultipleImages ? (
          <>
            <Carousel
              opts={{
                loop: true,
              }}
              setApi={setApi}
              className="w-full h-full"
            >
              <CarouselContent>
                {product.images?.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image.url || "/placeholder.png"}
                      alt={image.alt || product.title || ""}
                      className="object-cover"
                      width={500}
                      height={500}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Navigation Buttons - Only show on hover and if multiple images */}
            {isHovered && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Image
              src={product.images?.[0]?.url || "/placeholder.png"}
              alt={product.images?.[0]?.alt || product.title || ""}
              className="object-cover"
              width={500}
              height={500}
            />
          </>
        )}
      </div>

      {/* Product Info */}
      <div
        className="cursor-default select-text"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Caption className="line-clamp-2 pb-1 text-center">
          {product.title}
        </Caption>
        <Price className="flex flex-col items-center justify-center">
          {formatPrice(product.price || 0)}
          {product.discountedPrice &&
            product.discountedPrice < (product.price || 0) && (
              <span className="decoration-muted-foreground line-through opacity-80 text-xs">
                {formatPrice(product.discountedPrice)}
              </span>
            )}
        </Price>
      </div>
    </div>
  );
}

const WishlistSkeleton = () => {
  return (
    <Button variant={"ghost"} size={"icon"} className="h-8 w-8" disabled>
      <Heart className="h-4 w-4" />
    </Button>
  );
};
