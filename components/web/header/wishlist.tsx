"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";

export function HeaderWishlist() {
  const { itemCount } = useWishlist();

  return (
    <Button variant="ghost" size="icon">
      <Heart
        className={cn(
          "size-[18px] stroke-[1.5]",
          itemCount > 0 && "fill-primary text-primary"
        )}
      />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
          {itemCount}
        </span>
      )}
    </Button>
  );
}
