"use client";

import { Trash2, Heart } from "lucide-react";
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
import { useWishlist } from "@/hooks/use-wishlist";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeaderWishlistSheet() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  const handleRemoveItem = (id: string) => {
    removeFromWishlist(id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Heart
            className={cn(
              "size-[18px] stroke-[1.5]",
              items.length > 0 && "fill-primary text-primary"
            )}
          />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>My Wishlist ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Empty className="border-0 p-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Heart className="size-6" />
                </EmptyMedia>
                <EmptyTitle>Your wishlist is empty</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <EmptyDescription>
                  Save your favorite items to your wishlist and they will appear
                  here.
                </EmptyDescription>
                <Button asChild>
                  <Link href="/products">Explore Products</Link>
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  {item.image && (
                    <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium text-sm hover:underline truncate"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-semibold text-primary mt-auto pt-2">
                      Rs. {item.price.toLocaleString("en-PK")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 hover:text-destructive transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <Button size="sm" className="text-xs" asChild>
                      <Link href={`/products/${item.slug}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <Button asChild className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full text-destructive hover:text-destructive"
                onClick={clearWishlist}
              >
                Clear Wishlist
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
