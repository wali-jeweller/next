"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

export function HeaderCart() {
  const { itemCount } = useCart();

  return (
    <Button variant="ghost" size="icon">
      <ShoppingCart
        className={cn(
          "size-[18px] stroke-[1.5]",
          itemCount > 0 && "fill-primary"
        )}
      />
      {itemCount > 0 && (
        <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-xs font-medium">
          {itemCount}
        </div>
      )}
    </Button>
  );
}
