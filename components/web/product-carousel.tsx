"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
} from "@/components/ui/carousel";
import { H2 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function ProductCarousel({ children }: { children: React.ReactNode }) {
  const [api, setApi] = React.useState<CarouselApi>();

  return (
    <div className={cn("space-y-4 py-8")}>
      <div className="flex items-center justify-between">
        <H2>Similar Products</H2>
        <div className="flex space-x-2">
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={() => api?.scrollPrev()}
          >
            <ArrowLeft />
          </Button>
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={() => api?.scrollNext()}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>{children}</CarouselContent>
      </Carousel>
    </div>
  );
}
