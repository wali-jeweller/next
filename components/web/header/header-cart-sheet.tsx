"use client";

import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeaderCartSheet() {
  const { items, total, removeFromCart, updateQuantity } = useCart();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart
            className={cn(
              "size-[18px] stroke-[1.5]",
              items.length > 0 && "fill-primary"
            )}
          />
          {items.length > 0 && (
            <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-xs font-medium">
              {items.length}
            </div>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Empty className="border-0 p-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShoppingCart className="size-6" />
                </EmptyMedia>
                <EmptyTitle>Your cart is empty</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <EmptyDescription>
                  Add some items to your cart and they will appear here.
                </EmptyDescription>
                <Button asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-4 last:border-b-0"
                >
                  {item.image && (
                    <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug || item.id}`}
                      className="font-medium text-sm hover:underline truncate block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rs. {item.price.toLocaleString("en-PK")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-muted text-xs"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-muted text-xs"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-auto p-1 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right text-sm font-medium">
                    Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span>Rs. {total.toLocaleString("en-PK")}</span>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
