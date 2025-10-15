"use client";

import { ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { TCollection, TProduct } from "@/db/schema";
import { removeFromCollectionAction } from "../actions";

export const AssignCollection = ({
  product,
  collections,
}: {
  product: TProduct;
  collections: TCollection[];
}) => {
  const [isPending, startTransition] = useTransition();

  const handleRemoveCollection = (collectionId: string) => {
    startTransition(async () => {
      const res = await removeFromCollectionAction({
        collectionId,
        productId: product.id,
      });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Collection removed successfully");
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Collections</Label>
        <Button variant="outline" size="sm" asChild>
          <Link href="/collections">
            <ExternalLink className="size-3" />
            Manage in Collections
          </Link>
        </Button>
      </div>

      {collections.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <Badge
              key={c.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Link href={`/collections/${c.slug}`} className="hover:underline">
                {c.title}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-destructive hover:text-destructive-foreground h-4 w-4 p-0"
                onClick={() => handleRemoveCollection(c.id)}
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          No collections assigned. Use the Collections panel to assign this
          product to collections.
        </p>
      )}
    </div>
  );
};
