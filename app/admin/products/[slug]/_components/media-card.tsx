"use client";

import { GripVertical } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/ui/sortable";
import type { TProduct } from "@repo/db/schema";
import { cn } from "@/lib/utils";
import { updateProductImageOrderAction } from "../actions";
import { ImageItem } from "./image-item";
import { ImageUploader } from "./image-uploader";

export function MediaCard({ product }: { product: TProduct }) {
  const [isPending, startTransition] = React.useTransition();
  const [images, setImages] = React.useState(product.images || []);

  // Update local state when product.images changes
  React.useEffect(() => {
    setImages(product.images || []);
  }, [product.images]);

  const updateImageOrder = (newImages: NonNullable<TProduct["images"]>) => {
    // Update local state immediately
    setImages(newImages);

    // Persist the new order to the server
    startTransition(() => {
      updateProductImageOrderAction({
        productId: product.id,
        images: newImages.map((img, index) => ({ url: img.url, rank: index })),
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
        <CardDescription>Manage product media</CardDescription>
        <CardAction>
          <ImageUploader product={product} />
        </CardAction>
      </CardHeader>
      <CardContent className="border-t pt-4">
        {images.length > 0 ? (
          <Sortable
            value={images}
            getItemValue={(img) => img.url}
            onValueChange={updateImageOrder}
            orientation="mixed"
          >
            <SortableContent className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
              {images.map((image) => (
                <SortableItem
                  key={image.url}
                  value={image.url}
                  className="relative"
                  asChild
                >
                  <div
                    className={cn("h-full w-full", isPending && "opacity-50")}
                  >
                    <ImageItem image={image} productId={product.id}>
                      <SortableItemHandle asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                        >
                          <GripVertical className="text-black" />
                        </Button>
                      </SortableItemHandle>
                    </ImageItem>
                  </div>
                </SortableItem>
              ))}
            </SortableContent>
            <SortableOverlay>
              {({ value }) => {
                const item = images.find((img) => img.url === value);
                return item ? (
                  <div className="h-full w-full">
                    <ImageItem image={item} productId={product.id} />
                  </div>
                ) : null;
              }}
            </SortableOverlay>
          </Sortable>
        ) : (
          <div className="text-muted-foreground flex h-24 items-center justify-center">
            <p>No images found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
