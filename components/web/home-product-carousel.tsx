"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ProductItem, type ProductItemProps } from "./product-item";

interface HomePageCarouselProps {
  products: Array<ProductItemProps["product"]>;
  className?: string;
}

export function HomePageCarousel({
  products,
  className,
}: HomePageCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    setCount(api.scrollSnapList().length);
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", () => {
      setCount(api.scrollSnapList().length);
      onSelect();
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className={cn("relative", className)}>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="px-2"
        plugins={[]}
      >
        <CarouselContent>
          {products.map((p) => (
            <CarouselItem
              key={p.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <Link href={`/products/${p.slug}`} className="block">
                <ProductItem product={p} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Progress indicator with controls */}
      <div className="mt-8 flex w-full justify-center">
        <div className="flex w-full max-w-64 items-center gap-3">
          <Button
            aria-label="Previous"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => api?.scrollPrev()}
          >
            <ArrowLeft />
          </Button>
          <div className="bg-foreground/15 h-0.5 flex-1">
            <div
              className="bg-foreground/80 h-full transition-[width] duration-300"
              style={{
                width: `${
                  count > 1 ? ((selectedIndex + 1) / count) * 100 : 100
                }%`,
              }}
            />
          </div>
          <Button
            aria-label="Next"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => api?.scrollNext()}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
