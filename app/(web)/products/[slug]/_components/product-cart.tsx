"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Check } from "lucide-react";
import type { TProduct } from "@/db/schema";
import { cn } from "@/lib/utils";

export function ProductCart({
  product,
  categorySizes,
  className,
}: {
  product: TProduct;
  categorySizes: Array<{ value: string; unit: string }>;
  className?: string;
}) {
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();

  const hasSizes = categorySizes && categorySizes.length > 0;

  const handleAddToCart = async () => {
    // If product has sizes, require size selection
    if (hasSizes) {
      return;
    }

    try {
      await addToCart(
        {
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.images?.[0]?.url,
          slug: product.slug,
        },
        1
      );

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Can add to cart if: no sizes required OR size is selected
  const canAddToCart = !hasSizes;

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!canAddToCart}
      className={cn(className, "w-full")}
      size="lg"
      variant={!canAddToCart ? "outline" : "default"}
    >
      {showSuccess ? (
        <>
          <Check className="h-5 w-5" />
          Added to Cart
        </>
      ) : hasSizes ? (
        "Select Size"
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
}
