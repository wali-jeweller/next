"use client";

import { Heart } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";

// Minimal props for wishlist functionality
type ItemWishlistProps = React.ComponentProps<"div"> & {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  productSlug: string;
};

export function ItemWishlist({
  productId,
  productName,
  productPrice,
  productImage,
  productSlug,
  className,
}: ItemWishlistProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading } =
    useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleToggle = async () => {
    if (isWishlisted) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        slug: productSlug,
      });
    }
  };

  return (
    <form action={handleToggle}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "hover:bg-muted-foreground/10 rounded-full disabled:opacity-90",
          className
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleToggle();
        }}
        disabled={isLoading}
      >
        <Heart
          className={cn(
            "transition-colors duration-200",
            isWishlisted && "fill-primary text-primary"
          )}
        />
      </Button>
    </form>
  );
}
