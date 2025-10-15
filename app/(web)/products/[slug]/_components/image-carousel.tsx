"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import React from "react";
import type { TProduct } from "@/db/schema";
import { ZoomableImage } from "@/components/zoomable-image";

export const ImageCarousel = ({ images }: { images: TProduct["images"] }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleDotClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="mx-auto flex w-full max-w-full flex-col items-center gap-4 lg:hidden">
      <Carousel setApi={setApi} className="w-screen">
        <CarouselContent>
          {images?.map((image, index) => (
            <CarouselItem
              key={index}
              className="relative aspect-square w-full overflow-hidden"
            >
              <ZoomableImage
                src={image.url}
                alt={image.alt ?? ""}
                images={images.map((image) => ({
                  url: image.url,
                  alt: image.alt ?? "",
                }))}
                currentImageIndex={index}
                className="object-cover"
                fill
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`size-1.5 cursor-pointer rounded-full transition-colors ${
              current === index ? "bg-primary" : "bg-muted-foreground/30"
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
