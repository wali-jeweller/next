"use client";

import { cn } from "@/lib/utils";
import type { TProduct } from "@/db/schema";
import { ZoomableImage } from "@/components/zoomable-image";

export function ImageSection({ images }: { images: TProduct["images"] }) {
  return (
    <div
      className={cn(
        "hidden gap-1 lg:grid",
        images?.length && images.length > 3 ? "grid-cols-2" : "grid-cols-1"
      )}
    >
      {images?.map((image, index) => (
        <ZoomableImage
          key={index}
          src={image.url}
          alt={`${image.alt} - Image ${index + 1}`}
          images={images?.map((image) => ({
            url: image.url,
            alt: `${image.alt} - Image ${index + 1}`,
          }))}
          currentImageIndex={index}
          className="aspect-square h-auto w-full object-cover"
          height={1200}
          width={800}
          priority={true}
        />
      ))}
    </div>
  );
}
